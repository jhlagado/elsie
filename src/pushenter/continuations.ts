import { Continuation } from "./types";
import { run } from "./utils";
import { state } from "./state";

export const apply = (): Continuation | null => {

    const { closure, args } = state;
    const nargs = args.length;

    if (closure === null)
        return null;

    if (closure.arity === nargs)
        return closure.code;

    else if (nargs === 0) {
        return null;
    }
    else if (closure.arity > nargs) {
        let suppliedArgs = args;
        state.args = [];
        const pap = {
            arity: closure.arity - nargs,
            code: () => {
                state.args = [...suppliedArgs, ...state.args];
                state.closure = closure;
                return apply;
            }
        }
        state.closure = pap;
        return null;
    }
    else { // f.arity < nargs
        const remainingArgs = args.slice(closure.arity, nargs);
        state.args.length = closure.arity;
        run(closure.code)
        state.args = remainingArgs;
        return apply;
    }
}

export const update = (realcode: Continuation): Continuation | null => {
    const { closure } = state;
    run(realcode);
    const saveState = {
        RCons: state.RCons,
        RVal: state.RVal,
        args: state.args,
    };
    closure.code = () => {
        Object.assign(state, saveState);
        return null;
    }
    return null;
}

