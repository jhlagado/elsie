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
    code: () => {
        state.RCons = ConsTag;
        return null;
    }
}

export const Num = (value: number): Closure => {
    return ({
        arity: 0,
        value: value,
        code: () => {
            const { env: { value } } = state;
            state.currentValue = value;
            state.args = [];
            return null;
        },
        toString() {
            return `${value}`;
        }
    })
};

export const Str = (chars: any[] = []): Closure => {
    let value: any;
    if (chars.length === 0) {
        value = {
            code: Nil,
            args: [],
        };
    } else {
        const [head, ...tail] = chars;
        value = {
            code: Cons,
            args: [
                Num(charCode(head)),
                Str(tail),
            ],
        }
    }
    return ({
        arity: 0,
        value,
        code: (): Continuation => {
            const { code, args } = state.env.value;
            return enter(code, args, apply);
        },
        toString() {
            return `${chars.join()}`;
        }
    })
};
