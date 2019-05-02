export type Continuation = (() => (Continuation | null)) | null;

export interface Closure {
    arity: number;
    code: Continuation;
    realcode?: Continuation;
    saveState?: SaveState;
};

export interface SaveState {
    args: any[]; // arguments
    RCons: number; // constructor tag
    RVal: any; // Some returned value
}

export interface State extends SaveState {
    closure: Closure; // current entered closure
}

export const state: State = {
    closure: {
        arity: 0,
        code: () => null,
    },
    args: [],
    RCons: 0,
    RVal: null,
}

// mini interpreter is used to implement tail calls
// to jump to some function, we don't call it, but
// return it's address instead
export function run(destination: Continuation): void {
    let dest: Continuation | null = destination;
    while (dest != null)
        dest = dest();
}

export function apply(): Continuation {

    const { closure, args } = state;
    const nargs = args.length;

    if (closure === null)
        return null;

    if (closure.arity === nargs)
        return closure.code;

    else if (nargs === 0) {
        // we don't know what to do, so run a continuation
        return null;
    }
    // We CAN'T call a function,
    // so we must build a PAP and call continuation!!!
    else if (closure.arity > nargs) {
        let suppliedArgs = args;
        state.args = [];
        const pap = {
            arity: closure.arity - nargs,
            code: function () {
                state.args = [...suppliedArgs, ...state.args];
                state.closure = closure;
                return apply;
            }
        }
        state.closure = pap;
        // we don't know what to do, so run a continuation
        return null;
    }
    else {
        // f.arity < nargs
        const remainingArgs = args.slice(closure.arity, nargs);
        state.args.length = closure.arity;
        run(closure.code)
        // closure now points to some
        // new function, we'll try to call it
        state.args = remainingArgs;
        return apply;
    }
}

export function enterClosure(
    closure: Closure,
    args: any[],
    continuation: Continuation = apply
): Continuation {
    state.closure = closure;
    state.args = args;
    return continuation;
}

// Updates are called and used essentially as apply function
// updatable thunks pushes continuation and runs as usual
// when continuation activates it replaces the closure with the value
// after that it returns to the next continuation
export function update(): Continuation {
    const { closure } = state;
    if (closure === null)
        return null;
    if (!closure.realcode)
        return null;
    run(closure.realcode);
    closure.realcode = null;
    closure.saveState = {
        RCons: state.RCons,
        RVal: state.RVal,
        args: state.args,
    };
    closure.code = () => {
        Object.assign(state, closure.saveState);
        return null;
    }
    return null;
}

