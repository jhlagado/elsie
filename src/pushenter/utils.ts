import { Closure, Continuation } from "./types";
import { apply } from "./continuations";
import { state } from "./state";

export const run = (destination: Continuation): void => {
    let dest: Continuation | null = destination;
    while (dest != null)
        dest = dest();
}

export const enter = (
    closure: Closure,
    args: any[],
    continuation: Continuation = apply
): Continuation => {
    state.closure = closure;
    state.args = args;
    return continuation;
}

export const charCode = (str: string): number => str.charCodeAt(0);

export const char = (num: number): string => String.fromCharCode(num);
