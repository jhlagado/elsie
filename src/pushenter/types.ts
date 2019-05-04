export type Continuation = (() => (Continuation | null));

export interface Closure {
    arity: number;
    code: Continuation;
    toString: () => string;
};

export interface State {
    closure: Closure; // current entered closure
    args: any[]; // arguments
    RCons: number; // constructor tag
    RVal: any; // Some returned value
}
