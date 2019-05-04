import { Closure, Continuation, State } from './types';
import { apply } from './continuations';

export const run = (state: State, destination: Continuation | null): void => {
    let dest: Continuation | null = destination;
    while (dest != null)
        dest = dest(state);
}

export const enter = (
    state: State,
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

const stateStack: State[] = [];
export const pushState = (state: State) => stateStack.push({ ...state });
export const popState = (state: State) => { Object.assign(state, stateStack.pop()) };

export const checkValue = (state: State, closure: Closure, args: any[] = []) => {
    pushState(state);
    run(state, enter(state, closure, args, apply));
    const value = state.currentValue;
    popState(state);
    return value;
}

