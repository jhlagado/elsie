import {
    state,
    apply,
    enterClosure,
    Continuation,
} from './STG';

export const NilTag = 2;
export const Nil = {
    arity: 0,
    code: function () {
        state.RCons = NilTag;
        return null;
    }
}

export const ConsTag = 3;
export const Cons = {
    arity: 2,
    code: function () {
        state.RCons = ConsTag;
        return null;
    }
}

export const Num = (value: number) => ({
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

export const Str = (value: string) => ({
    arity: 0,
    code: (): Continuation => {
        if (value.length === 0) {
            return enterClosure(Nil, [], apply);
        } else {
            return enterClosure(Cons, [
                Num(value.charCodeAt(0)),
                Str(value.slice(1, value.length))
            ], apply);
        }
    },
    toString() {
        return `${value}`;
    }
});
