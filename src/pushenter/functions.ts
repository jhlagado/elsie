import { Closure } from './types';
import { run, enter } from './utils';
import { apply, update } from './continuations';

import {
    ConsTag,
    Cons,
    Nil,
    Num,
} from './constructors';
import { state } from './state';

/*
    add = \a b -> case a of {a -> case b of {b -> primOp + a b}}
*/
export const add: Closure = {
    arity: 2,
    code: () => {
        const [a, b] = state.args;
        run(enter(a, [], apply));
        const aNum = state.RVal;
        run(enter(b, [], apply));
        const bNum = state.RVal;
        state.RVal = aNum + bNum;
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
    code: () => {
        const [f, g, x] = state.args;
        const gx = {
            arity: 0,
            code: update(() => enter(g, [x], apply)),
        }
        return enter(f, [gx], apply);
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
    code: () => {
        const [f, xs] = state.args;
        run(enter(xs, [], xs.code));
        switch (state.RCons) {
            case ConsTag:
                const [x, xs] = state.args;
                const fx = {
                    arity: 0,
                    code: update(() => enter(f, [x], apply)),
                }
                const mapfxs = {
                    arity: 0,
                    code: update(() => enter(map, [f, xs], apply)),
                }
                return enter(Cons, [fx, mapfxs], apply);

            default: //NilTag:
                return enter(Nil, [], Nil.code);
        }
    }
}

export const inc3: Closure = {
    arity: 0,
    code: () => enter(add, [Num(3)], apply),
}
