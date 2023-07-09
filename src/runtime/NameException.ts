import Exception from './Exception';
import type Evaluator from './Evaluator';
import type Locale from '@locale/Locale';
import type Token from '@nodes/Token';
import Value from './Value';
import NodeLink from '@locale/NodeRef';
import ValueLink from '@locale/ValueRef';
import concretize from '../locale/concretize';

export default class NameException extends Exception {
    readonly name: Token | undefined;
    readonly scope: Value | undefined;

    constructor(
        name: Token | undefined,
        scope: Value | undefined,
        evaluator: Evaluator
    ) {
        super(evaluator);

        this.name = name;
        this.scope = scope;
    }

    getDescription(locale: Locale) {
        return concretize(
            locale,
            locale.exception.name,
            this.name
                ? new NodeLink(
                      this.name,
                      locale,
                      this.getNodeContext(this.name),
                      this.name.getText()
                  )
                : undefined,
            this.scope instanceof Value
                ? new ValueLink(
                      this.scope,
                      locale,
                      this.getNodeContext(this.scope.creator)
                  )
                : undefined
        );
    }
}
