import { State } from "./types";

export const emptyClosure = {
    arity: 0,
    code: () => null,
}

export const initialState: State = {
    closure: emptyClosure,
    args: [],
    RCons: 0,
    RVal: null,
}

export const state: State = initialState;

export const initialise = () => Object.assign(state, initialState);
