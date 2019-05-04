export type Continuation = (() => (Continuation | null));

export interface Closure {
    value?: any;
    arity: number;
    code: Continuation;
    toString: () => string; //defaults to prototype method
};

export interface State {
    env: Closure; // current entered closure
    args: any[]; // arguments
    RCons: number; // constructor tag
    currentValue: any; // Some returned value
}
