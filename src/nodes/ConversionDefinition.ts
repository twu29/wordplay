import type Node from "./Node";
import Expression from "./Expression";
import Token from "./Token";
import TokenType from "./TokenType";
import type Conflict from "../conflicts/Conflict";
import { MisplacedConversion } from "../conflicts/MisplacedConversion";
import Block from "./Block";
import ConversionType from "./ConversionType";
import Type from "./Type";
import type Evaluator from "../runtime/Evaluator";
import type Step from "../runtime/Step";
import Finish from "../runtime/Finish";
import Conversion from "../runtime/Conversion";
import type Context from "./Context";
import { parseType, tokens } from "../parser/Parser";
import { CONVERT_SYMBOL } from "../parser/Tokenizer";
import type Bind from "./Bind";
import type { TypeSet } from "./UnionType";
import ContextException, { StackSize } from "../runtime/ContextException";
import { getPossibleTypeReplacements } from "../transforms/getPossibleTypes";
import { getExpressionReplacements } from "../transforms/getPossibleExpressions";
import type Transform from "../transforms/Transform"
import Replace from "../transforms/Replace";
import TypePlaceholder from "./TypePlaceholder";
import ExpressionPlaceholder from "./ExpressionPlaceholder";
import type Translations from "./Translations";
import { TRANSLATE } from "./Translations"
import Docs from "./Docs";
import Start from "../runtime/Start";

export default class ConversionDefinition extends Expression {

    readonly docs: Docs;
    readonly arrow: Token;
    readonly input: Type;
    readonly output: Type;
    readonly expression: Expression;

    constructor(docs: Docs | Translations, input: Type | string, output: Type | string, expression: Expression, convert?: Token) {
        super();

        this.docs = docs instanceof Docs ? docs : new Docs(docs);
        this.arrow = convert ?? new Token(CONVERT_SYMBOL, TokenType.CONVERT);
        this.input = typeof input === "string" ? parseType(tokens(input)) : input;
        this.output = typeof output === "string" ? parseType(tokens(output)) : output;
        this.expression = expression;

        this.computeChildren();

    }

    getGrammar() { 
        return [
            { name: "docs", types:[ Docs ] },
            { name: "arrow", types:[ Token ] },
            { name: "input", types:[ Type ] },
            { name: "output", types:[ Type ] },
            { name: "expression", types:[ Expression ] },
        ]; 
    }

    replace(pretty: boolean=false, original?: Node, replacement?: Node) { 
        return new ConversionDefinition(
            this.replaceChild(pretty, "docs", this.docs, original, replacement), 
            this.replaceChild(pretty, "input", this.input, original, replacement), 
            this.replaceChild(pretty, "output", this.output, original, replacement), 
            this.replaceChild(pretty, "expression", this.expression, original, replacement), 
            this.replaceChild(pretty, "arrow", this.arrow, original, replacement)
        ) as this; 
    }

    isBlock(child: Node) { return child === this.expression; }

    convertsTypeTo(input: Type, output: Type, context: Context) {
        return  this.input.accepts(input, context) && this.output.accepts(output, context);
    }

    convertsType(input: Type, context: Context) {
        return this.input.accepts(input, context);
    }

    computeConflicts(context: Context): Conflict[] { 
        
        const conflicts: Conflict[] = [];
    
        // Can only appear in a block, or not in the program (native)
        const enclosure = context.get(this)?.getBindingScope();
        if(enclosure !== undefined && !(enclosure instanceof Block))
            conflicts.push(new MisplacedConversion(this));
    
        return conflicts; 
    
    }

    computeType(): Type {
        return new ConversionType(this.input, undefined, this.output);
    }

    getDependencies(): Expression[] {
        return [ this.expression ];
    }

    compile(): Step[] {
        return [ new Start(this), new Finish(this) ];
    }

    evaluate(evaluator: Evaluator) {

        const context = evaluator.getCurrentEvaluation();
        if(context === undefined) return new ContextException(StackSize.EMPTY, evaluator);

        context.addConversion(new Conversion(this, context));
        
    }

    evaluateTypeSet(bind: Bind, original: TypeSet, current: TypeSet, context: Context) { 
        if(this.expression instanceof Expression)
            this.expression.evaluateTypeSet(bind, original, current, context);
        return current;
    }
 
    getChildReplacement(child: Node, context: Context): Transform[] | undefined { 
        
        if(child === this.input || child === this.output)
            return getPossibleTypeReplacements(child, context);
        // Expression can be anything
        if(child === this.expression)
            return getExpressionReplacements(this, this.expression, context);

    }

    getInsertionBefore(): Transform[] | undefined { return undefined; }
    getInsertionAfter(): Transform[] | undefined { return []; }

    getChildRemoval(child: Node, context: Context): Transform | undefined {
        if(child === this.input || child === this.output) return new Replace(context, child, new TypePlaceholder());
        else if(child === this.expression) return new Replace(context, child, new ExpressionPlaceholder());
    }

    getDescriptions(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "A value conversion function"
        }
    }

    getStart() { return this.arrow; }

    getStartExplanations(): Translations { return this.getFinishExplanations(); }

    getFinishExplanations(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "Let's define this conversion!"
        }
    }


}