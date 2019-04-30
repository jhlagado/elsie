export type Atom = symbol | string | number;
export const ATOM_TYPES = new Set(['number', 'string', 'symbol']);

export type Tuple = [string, ...any[]];
export type Expr = Tuple | Atom;

export type WildCard = 'WILD_CARD';
export const WILD_CARD: WildCard = 'WILD_CARD';

export const isString = (obj: any): obj is string =>
    Object.prototype.toString.call(obj) === "[object String]"

export const isAtom = (obj: any): obj is Atom =>
    ATOM_TYPES.has(typeof obj);

export const isTuple = (obj: any, tag?: string, length?: number): obj is Tuple =>
    Array.isArray(obj) &&
    obj.length > 0 &&
    isString(obj[0]) &&
    (tag == null || tag === obj[0]) &&
    (length == null || obj.length === length);

export const isExpr = (obj: any): obj is Expr =>
    isTuple(obj) || isAtom(obj);

type Nil = ['Nil'];
export const isNil = (obj: any): obj is Nil =>
    isTuple(obj) && obj.length === 1 && obj[0] === 'Nil';

export const isWildCard = (obj: any): obj is WildCard =>
    obj === 'WILD_CARD';

export type StackObject = any;
export type HeapObject = any;

export type Pattern = ['Pattern', Tuple, Tuple];

export type StateReducer = (state: State) => State;

export type PrimOp = (...args: any[]) => Expr;

export interface State {
    expression: Expr;
    stack: StackObject[];
    heap: HeapObject[];
    globals: { [key: string]: PrimOp };
}

export type Rule = ['Rule', Tuple, StateReducer];

export type Ref = ['Ref', number | string];
export const isRef = (obj: any): obj is Ref => isTuple(obj, 'Ref', 2);
