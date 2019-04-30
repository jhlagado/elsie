import { State, HeapObject, Expr, isAtom, isTuple, Tuple, Ref, isString } from "./types";

//             expr                       stack           Heap                    =>  expr                        stack           Heap
// ===============================================================================================================================================
// LET         let(x,obj,e)               s               H                           e[x'/x]                     s               H[x' -> obj]
// CASECON     case(v) of C x1 ... xn,e   s               H[v -> CON(C a1 ... an)]    e[a1/x1...a/ax]             s               H
// CASEANY     case(v) of x,e             s               H                           e[v/x]                      s               H
// CASE        case(e)                    s               H                           e                           case(.):s       H
// RET         ident v                    case(.):s       H                           case(v) CASECON CASEANY     s               H
// THUNK       ident x                    s               H[x -> THUNK e]             e                           Upd x .:s       H[x -> BLACKHOLE]
// UPDATE      ident y                    Upd x .:s       H                           y                           s               H[x -> H[y]]
// KNOWNCALL   fn a1...an                 s               H[f -> FUN(x1...xn,e)]      e[a1/x1...an/xn]            s               H
// PRIMOP      +  a1...an                 s               H                           a                           s               H
// EXACT       f. a1...an                 s               H[f -> FUN(x1..xn,e)]       e[a1/x1...an/xn]            s               H
// CALLK       fk a1...am                 s               H[f -> FUN(x1..xn,e)]       e[a1/x1...an/xn]            (. an+1...am):s H
// PAP2        fk a1...am                 s               H[f -> FUN(x1..xn,e)]       p                           s               H[p -> PAP(f a1...am)]
// TCALL       f. a1...am                 s               H[f -> THUNK e]             f                           (. a1...am)     H
// PCALL       fk an+1...am               s               H[p -> PAP(g a1...an)]      g. a1...an an+1...am        s               H
// RETFUN      ident f                    (. a1...an):s   H                           f. a1...an                  s               H

export type Kont = [State, (() => Kont) | null];

export function trampoline(k: Kont) {
    let [state, f] = k;
    while (f !== null) {
        [state, f] = f();
    }
    return state;
}

export const heapAlloc = (state: State, object: HeapObject): Ref => {
    const ptr = state.heap.length;
    state.heap[ptr] = object;
    return ['Ref', ptr];
}

export const doLiteral = (_state: State, e: Expr, ..._args: any[]): Expr => ['Literal', e];
export const doSomething = (_state: State, _e: Expr, ...args: any[]): Expr => ['Something', ...args];

export const getThunkCode = (_e: Expr) => {
    return doSomething;
}

export const isFunction = (f: any) => (typeof f === "function");

export const getFunCode = (e: Tuple) =>
    isFunction(e[1]) ? e[1] : doSomething;

export const getArity = (e: Tuple) =>
    isFunction(e[1]) ? e[1].length : e[2];

export const getFree = (e: Tuple) =>
    isFunction(e[1]) ? 0 : e[1];

export const getPapCode = (_e: Tuple) => doSomething;

export const getPapArity = (_e: Tuple) => 3;

export const createPap = (e: Expr, args: any[]): Expr => ['PAP', e, args];

export const createPapFromPap = (e: Expr, args: any[]): Expr => ['PAP', e, args];

export const resolveRef = (state: State, e: Expr) => {
    if (isTuple(e, 'Ref', 2)) {
        const [, key] = e;
        return state.heap[key];
    }
    else if (isString(e)) {
        return state.globals[e];
    }
    else
        return undefined;
}

type THUNK = ['THUNK', Expr];
export const isThunk = (obj: any): obj is THUNK => isTuple(obj, 'THUNK', 2)

export const kontinue = (state: State, e: Expr, args: any[]): Kont => {
    if (isAtom(e)){
        state.expression = e;
        return [state, null];
    }
    else if (e[0] === 'THUNK') {
        const ecode = getThunkCode(e);
        const e1 = ecode(state, e);
        return [state, () => kontinue(state, e1, args)];
    }
    else if (e[0] === 'FUN') {
        const arity = getArity(e);
        const free = getFree(e);
        const numArgs = args.length - free;
        if (numArgs > arity) {
            const ecode = getFunCode(e);
            const e1 = ecode(state, e, args.slice(0, free + arity));
            return [state, () => kontinue(state, e1, args.slice(free + arity))];
        }
        else if (numArgs === arity) {
            const ecode = getFunCode(e);
            const e1 = ecode(state, e, args);
            return [state, () => kontinue(state, e1, args)];
        }
        else {
            const pap: Expr = createPap(e, args);
            return [state, () => kontinue(state, pap, [])];
        }
    }
    else if (e[0] === 'PAP') {
        const papArity = getPapArity(e);
        const numArgs = args.length;
        if (numArgs > papArity) {
            const ecode = getPapCode(e);
            const e1 = ecode(state, e, args.slice(0, papArity));
            return [state, () => kontinue(state, e1, args.slice(papArity))];
        }
        else if (numArgs === papArity) {
            const ecode = getPapCode(e);
            const e1 = ecode(state, e, args);
            return [state, () => kontinue(state, e1, args)];
        }
        else {
            const pap: Expr = createPapFromPap(e, args);
            return [state, () => kontinue(state, pap, [])];
        }
    }
    else {
        const key = e[0];
        const fun = state.globals[key];
        if (!fun) return [state, null];
        const args2 = e.slice(1).map(item =>
            isTuple(item, 'VRef', 2) ?
                args[item[1]] :
                item
        );
        return [state, () => kontinue(state, fun(...args2), [])];
    }
};

