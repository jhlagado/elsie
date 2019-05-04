import { Closure, Continuation, State } from "./types";
import { apply } from "./continuations";
import { state, pushState, popState } from "./state";

export const run = (state: State, destination: Continuation | null): void => {
    let dest: Continuation | null = destination;
    while (dest != null)
        dest = dest(state);
}

export const enter = (
    closure: Closure,
    args: any[],
    continuation: Continuation = apply
): Continuation | null => {
    state.env = closure;
    state.args = args;
    return continuation(state);
}

export const charCode = (str: string): number => str.charCodeAt(0);

export const char = (num: number): string => String.fromCharCode(num);

export const checkValue = (closure: Closure, args: any[] = []) => {
    pushState();
    run(state, enter(closure, args, apply));
    const value = state.currentValue;
    popState();
    return value;
}

