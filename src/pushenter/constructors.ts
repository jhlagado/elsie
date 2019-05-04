import { Closure, Continuation } from './types';
import { enter, charCode } from './utils';
import { apply } from './continuations';
import { state } from './state';

export const NilTag = 2;
export const ConsTag = 3;

export const Nil: Closure = {
    arity: 0,
    code: () => {
        state.RCons = NilTag;
        return null;
    }
}

export const Cons: Closure = {
    arity: 2,
    code:  () => {
        state.RCons = ConsTag;
        return null;
    }
}

export const Num = (value: number): Closure => ({
    arity: 0,
    code: () => {
        state.RVal = value;
        state.args = [];
        return null;
    },
    toString() {
        return `${value}`;
    }
});

export const Str = (value: string): Closure => ({
    arity: 0,
    code: (): Continuation => {
        if (value.length === 0) {
            return enter(Nil, [], apply);
        } else {
            const [head, tail] = value;
            return enter(Cons, [
                Num(charCode(head)),
                Str(tail),
            ], apply);
        }
    },
    toString() {
        return `${value}`;
    }
});
