import { Closure } from './types';
import { run, enter } from './utils';
import { apply, update } from './continuations';
import { ConsTag, Cons, Nil, Num, } from './constructors';
import { State } from './types';

/*
    add = \a b -> case a of {a -> case b of {b -> primOp + a b}}
*/
export const add: Closure = {
    arity: 2,
    value: null,
    code: (state: State) => {
        const [a, b] = state.args;
        run(state, enter(state, a, [], apply));
        const aNum = state.currentValue;
        run(state, enter(state, b, [], apply));
        const bNum = state.currentValue;
        state.currentValue = aNum + bNum;
        state.args = [];
        return null;
    }
}

/*
  compose = \f g x ->
     let gx = g x
     in f gx
*/
export const compose: Closure = {
    arity: 2,
    value: null,
    code: (state: State) => {
        const [f, g, x] = state.args;
        const gx = {
            arity: 0,
            code: update(state, (state: State) => enter(state, g, [x], apply)),
        }
        return enter(state, f, [gx], apply);
    }
}

/*
    map = \f xs->
        case xs of {
            Cons x xs ->
              let fx = f x
              in let mapfxs = map f xs
                 in Cons fx mapfxs
            ; Nil -> Nil
        }
*/
export const map: Closure = {
    arity: 2,
    value: null,
    code: (state: State) => {
        const [f, xs] = state.args;
        run(state, enter(state, xs, [], xs.code));
        switch (state.RCons) {
            case ConsTag:
                const [x, xs] = state.args;
                const fx = {
                    arity: 0,
                    code: update(state, (_state) => enter(state, f, [x], apply)),
                }
                const mapfxs = {
                    arity: 0,
                    code: update(state, (_state) => enter(state, map, [f, xs], apply)),
                }
                return enter(state, Cons, [fx, mapfxs], apply);

            default: //NilTag:
                return enter(state, Nil, [], Nil.code);
        }
    }
}

export const inc3: Closure = {
    arity: 0,
    value: null,
    code: (state: State) => enter(state, add, [Num(3)], apply),
}
