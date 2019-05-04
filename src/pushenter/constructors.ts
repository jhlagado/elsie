import { Closure, Continuation, State } from './types';
import { enter, charCode } from './utils';
import { apply } from './continuations';

export const NilTag = 2;
export const ConsTag = 3;

export const Nil: Closure = {
    arity: 0,
    code: (state: State) => {
        state.RCons = NilTag;
        return null;
    }
}

export const Cons: Closure = {
    arity: 2,
    code: (state: State) => {
        state.RCons = ConsTag;
        return null;
    }
}

export const Num = (value: number): Closure => {
    return ({
        arity: 0,
        value: value,
        code: (state: State) => {
            const { env: { value } } = state;
            state.currentValue = value;
            state.args = [];
            return null;
        },
    })
};

export const List = (items: any[] = []): Closure => {
    let value: any;
    if (items.length === 0) {
        value = {
            code: Nil,
            args: [],
        };
    } else {
        const [head, ...tail] = items;
        value = {
            code: Cons,
            args: [
                Num(charCode(head)),
                List(tail),
            ],
        }
    }
    return ({
        arity: 0,
        value,
        code: (state: State): Continuation | null=> {
            const { code, args } = state.env.value;
            return enter(state, code, args, apply);
        },
    })
};

export const Str = (chars: any[] = []): Closure => List(chars);
