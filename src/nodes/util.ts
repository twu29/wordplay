import CaseSensitive from "../conflicts/CaseSensitive";
import DuplicateAliases from "../conflicts/DuplicateAliases";
import DuplicateLanguages from "../conflicts/DuplicateLanguages";
import DuplicateTypeVariables from "../conflicts/DuplicateTypeVariables";
import RequiredAfterOptional from "../conflicts/RequiredAfterOptional";
import VariableLengthArgumentMustBeLast from "../conflicts/VariableLengthArgumentMustBeLast";
import type Alias from "./Alias";
import Bind from "./Bind";
import type Context from "./Context";
import type Documentation from "./Documentation";
import type Language from "./Language";
import TypeVariable from "./TypeVariable";
import type Unparsable from "./Unparsable";
import type Node from "./Node";
import type Name from "./Name";
import type TableType from "./TableType";
import type Row from "./Row";
import type Conflict from "../conflicts/Conflict";
import UnknownColumn from "../conflicts/UnknownColumn";
import IncompatibleCellType from "../conflicts/IncompatibleCellType";
import MissingCell from "../conflicts/MissingCell";
import InvalidRow from "../conflicts/InvalidRow";
import Token from "./Token";
import TokenType from "./TokenType";
import type Translations from "./Translations";
import { ANONYMOUS_SYMBOL } from "../parser/Tokenizer";

export function getDuplicateDocs(docs: Documentation[]): DuplicateLanguages | undefined {
    const duplicatesByLanguage = new Map<string, Language[]>();
    docs.forEach(doc => { 
        const language = doc.getLanguage();
        if(language !== undefined && doc.lang !== undefined) {
            let duplicates = duplicatesByLanguage.get(language);
            if(duplicates === undefined) { duplicates = []; duplicatesByLanguage.set(language, duplicates); }
            duplicates.push(doc.lang);
        }
    });
    duplicatesByLanguage.forEach((dupes, language) => {
        if(dupes.length === 1)
            duplicatesByLanguage.delete(language);
    });

    return duplicatesByLanguage.size > 0 ? new DuplicateLanguages(docs, duplicatesByLanguage) : undefined;

}

export function getDuplicateAliases(aliases: Alias[]): DuplicateAliases | undefined {
    const duplicatesByName = new Map<string, Alias[]>();
    aliases.forEach(alias => { 
        const name = alias.getName();
        if(name !== undefined) {
            let duplicates = duplicatesByName.get(name);
            if(duplicates === undefined) { duplicates = []; duplicatesByName.set(name, duplicates); }
            duplicates.push(alias);
        }
    });
    duplicatesByName.forEach((dupes, language) => {
        if(dupes.length === 1)
            duplicatesByName.delete(language);
    });
    return duplicatesByName.size > 0 ? new DuplicateAliases(duplicatesByName) : undefined;
}

export function typeVarsAreUnique(vars: (TypeVariable|Unparsable)[]): DuplicateTypeVariables | undefined {
    const typeVars = vars.filter(v => v instanceof TypeVariable) as TypeVariable[];
    const duplicatesByName = new Map<string, TypeVariable[]>();
    typeVars.forEach(variable => { 
        const language = variable.name.getText();
        if(language !== undefined && variable.name !== undefined) {
            let duplicates = duplicatesByName.get(language);
            if(duplicates === undefined) { duplicates = []; duplicatesByName.set(language, duplicates); }
            duplicates.push(variable);
        }
    });
    duplicatesByName.forEach((dupes, language) => {
        if(dupes.length === 1)
            duplicatesByName.delete(language);
    });

    return duplicatesByName.size > 0 ? new DuplicateTypeVariables(duplicatesByName) : undefined;

}

export function requiredBindAfterOptional(inputs: (Bind|Unparsable)[]): RequiredAfterOptional | undefined {

    const binds = inputs.filter(i => i instanceof Bind) as Bind[];
    let foundOptional = false;
    let requiredAfterOptional: Bind | undefined = undefined;
    binds.forEach(bind => {
        if(bind.value !== undefined) foundOptional = true;
        else if(bind.value === undefined && foundOptional && requiredAfterOptional === undefined)
            requiredAfterOptional = bind;
    })

    return inputs.length === binds.length && requiredAfterOptional !== undefined ?
        new RequiredAfterOptional(requiredAfterOptional) :
        undefined;

}

export function restIsNotLast(inputs: (Bind|Unparsable)[]) {

    const rest = inputs.find(i => i instanceof Bind && i.isVariableLength()) as Bind | undefined;
    return rest !== undefined && inputs.indexOf(rest) !== inputs.length - 1 ?
        new VariableLengthArgumentMustBeLast(rest) : undefined;

}

export function getEvaluationInputConflicts(inputs: (Bind|Unparsable)[]) {

    const conflicts = [];

    // Structure input names must be unique
    const duplicateInputs = getDuplicateAliases(inputs.map(i => i instanceof Bind ? i.aliases : []).flat());
    if(duplicateInputs) conflicts.push(duplicateInputs);
    
    // Required inputs can never follow an optional one.
    const requiredAfterOptional = requiredBindAfterOptional(inputs);
    if(requiredAfterOptional) conflicts.push(requiredAfterOptional);

    // Rest arguments must be last
    const restIsntLast = restIsNotLast(inputs);
    if(restIsntLast) conflicts.push(restIsntLast);
    
    return conflicts;

}

export function getCaseCollision(name: string, enclosure: Node | undefined, context: Context, node: Name | Alias): CaseSensitive | undefined {

    if(enclosure === undefined) return;

    const upper = name.toLocaleUpperCase();
    const lower = name.toLocaleLowerCase();
    const otherCase = upper === lower ? undefined : name === upper ? lower : upper;

    if(otherCase === undefined) return;

    const otherBind = enclosure.getDefinitionOfName(otherCase, context, node);
    if(otherBind instanceof Bind) {
        const alias = otherBind.aliases.find(n => n.getName() === otherCase);
        if(alias !== undefined)
            return new CaseSensitive(node, alias);
    }

}

export function analyzeRow(tableType: TableType, row: Row, context: Context): Conflict[] {

    const conflicts: Conflict[] = [];

    // The row must "match" the columns, where match means that all columns without a default get a value.
    // Rows can either be all unnamed and provide values for every column or they can be selectively named,
    // but must provide a value for all non-default columns. No other format is allowed.
    // Additionally, all values must match their column's types.
    if(row.allBinds()) {
        // Ensure every bind is a valid column.
        const matchedColumns = [];
        for(const cell of row.cells) {
            if(cell.value instanceof Bind) {
                const column = tableType.getColumnNamed(cell.value.getNames()[0]);
                if(column === undefined)
                    conflicts.push(new UnknownColumn(tableType, cell));
                else {
                    matchedColumns.push(column);
                    const expected = column.getValueType(context);
                    const given = cell.getType(context);
                    if(!expected.accepts(given, context))
                        conflicts.push(new IncompatibleCellType(tableType, cell, expected, given));
                }
            }
        }
        // Ensure all non-default columns were specified.
        for(const column of tableType.columns) {
            if(!matchedColumns.includes(column) && !column.hasDefault())
                conflicts.push(new MissingCell(row, tableType, column));
        }
    }
    else if(row.allExpressions()) {
        const cells = row.cells.slice();
        for(const column of tableType.columns) {
            const cell = cells.shift();
            if(cell === undefined)
                conflicts.push(new MissingCell(row, tableType, column));
            else {
                const expected = column.getValueType(context);
                const given = cell.getType(context);
                if(!expected.accepts(given, context))
                    conflicts.push(new IncompatibleCellType(tableType, cell, expected, given));
            }
        }
    }
    else
        conflicts.push(new InvalidRow(row));

    return conflicts;

}

export function endsWithName(node: Node) { 
    const tokens = node.nodes(t => t instanceof Token) as Token[];
    return tokens.length > 0 && tokens[tokens.length - 1].is(TokenType.NAME);
}

export function startsWithName(node: Node) { 
    const tokens = node.nodes(t => t instanceof Token) as Token[];
    return tokens.length > 0 && tokens[0].is(TokenType.NAME);
}

export function aliasesToTranslations(aliases: Alias[]): Translations {

    // Define some default translations using whatever aliases are defined.
    const translations: Translations = {
        eng: aliases.find(a => a.getLanguage() === undefined)?.getName() ?? aliases[0].getName() ?? "anonymous",
        "😀": aliases.find(a => a.getLanguage() === undefined)?.getName() ?? aliases[0].getName() ?? ANONYMOUS_SYMBOL
    }

    // Override with the alias list.
    for(const alias of aliases) {
        const lang = alias.getLanguage();
        const name = alias.getName();
        if(lang !== undefined && name !== undefined)
            (translations as Record<string,string>)[lang] = name;
    }

    return translations as Translations;

}