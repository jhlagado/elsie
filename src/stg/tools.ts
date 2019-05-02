import {
    state,
    apply,
    enterClosure,
    run,
    update,
    Continuation
} from './STG';

import {
    ConsTag,
    Cons,
    Nil,
    Num,
} from './constructors';

////////////////////////////////////////////////////////////////////
// Examples: STG -> JS
/* add = \a b -> case a of {a -> case b of {b -> primOp + a b}} */

export const add = {
    arity: 2,
    code: function () {
        const [a, b] = state.args;
        run(enterClosure(a, [], apply));
        const aNum = state.RVal;
        run(enterClosure(b, [], apply));
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
export const compose = {
    arity: 2,
    code: function () {
        const [f, g, x] = state.args;
        const gx = {
            arity: 0,
            code: update,
            realcode: function () {
                return enterClosure(g, [x], apply);
            }
        }
        return enterClosure(f, [gx], apply);
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
export const map = {
    arity: 2,
    code: function () {
        const [f, xs] = state.args;
        //push continuation and enter xs
        run(enterClosure(xs, [], xs.code));
        switch (state.RCons) {
            case ConsTag:
                const [x, xs] = state.args;
                const fx = {
                    arity: 0,
                    code: update,
                    realcode: function () {
                        return enterClosure(f, [x], apply);
                    }
                }
                const mapfxs = {
                    arity: 0,
                    code: update,
                    realcode: function (): Continuation {
                        return enterClosure(map, [f, xs], apply);
                    }
                }
                return enterClosure(Cons, [fx, mapfxs], apply);
            default: //NilTag:
                return enterClosure(Nil, [], Nil.code);
        }
    }
}

export const inc3 = {
    arity: 0,
    code: function () {
        return enterClosure(add, [Num(3)], apply);
    }
}
