import type Evaluate from '@nodes/Evaluate';
import Conflict from './Conflict';
import type Bind from '@nodes/Bind';
import type BinaryEvaluate from '@nodes/BinaryEvaluate';
import type FunctionDefinition from '@nodes/FunctionDefinition';
import type StructureDefinition from '@nodes/StructureDefinition';
import type Expression from '@nodes/Expression';
import type Token from '@nodes/Token';
import type Context from '@nodes/Context';
import NodeRef from '@locale/NodeRef';
import type StreamDefinition from '../nodes/StreamDefinition';
import type Locales from '../locale/Locales';
import ConceptRef from '@locale/ConceptRef';
import type UnaryEvaluate from '@nodes/UnaryEvaluate';

export default class MissingInput extends Conflict {
    readonly func: FunctionDefinition | StructureDefinition | StreamDefinition;
    readonly evaluate: Evaluate | BinaryEvaluate | UnaryEvaluate;
    readonly last: Token | Expression;
    readonly input: Bind;

    constructor(
        func: FunctionDefinition | StructureDefinition | StreamDefinition,
        evaluate: Evaluate | BinaryEvaluate | UnaryEvaluate,
        last: Token | Expression,
        expected: Bind,
    ) {
        super(false);
        this.func = func;
        this.evaluate = evaluate;
        this.last = last;
        this.input = expected;
    }

    getConflictingNodes() {
        return {
            primary: {
                node: this.evaluate.fun,
                explanation: (locales: Locales, context: Context) =>
                    locales.concretize(
                        (l) => l.node.Evaluate.conflict.MissingInput.primary,
                        this.func.names.getPreferredNameString(
                            locales.getLocales(),
                        ) ?? this.func.names.getFirst(),
                        context.project.contains(this.input)
                            ? new NodeRef(this.input, locales, context)
                            : new ConceptRef(
                                  `${this.func.getPreferredName(
                                      locales.getLocales(),
                                  )}/${this.input.getPreferredName(
                                      locales.getLocales(),
                                  )}`,
                              ),
                    ),
            },
            secondary: {
                node: this.input,
                explanation: (locales: Locales, context: Context) =>
                    locales.concretize(
                        (l) => l.node.Evaluate.conflict.MissingInput.secondary,
                        new NodeRef(this.evaluate.fun, locales, context),
                    ),
            },
        };
    }
}
