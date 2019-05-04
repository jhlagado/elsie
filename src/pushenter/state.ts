import { State, Closure } from './types';

export const emptyClosure: Closure = {
    arity: 0,
    value: null,
    code: (_state: State) => null,
}

export const initialState: State = {
    env: emptyClosure,
    args: [],
    RCons: 0,
    currentValue: null,
}

export const state: State = initialState;

export const initialise = () => Object.assign(state, initialState);

