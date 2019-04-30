import { Tuple, isTuple, Rule, State, Ref } from "../types";
import { matchRule } from "../main";

describe(`match rules`, () => {

    it(`should match the rule`, () => {
        const state: State = {
            expression: ['Let', 3, ['Add', ['VRef', 0], ['VRef', 0]]],
            stack: [],
            heap: [],
            globals: {
                'Add': ([,a]: Ref, [,b]: Ref) => {
                    const a1 = state.heap[a as any];
                    const b1 = state.heap[b as any];
                    return a1 + b1;
                }
            },
        };
        const code: Tuple = ['Pattern', state.expression, state.stack[0]];
        const rule: Rule | undefined = matchRule(code);
        expect(rule).toBeDefined();
        if (!rule) return;
        expect(isTuple(rule[1][1], 'Let', 3)).toBe(true);
        const update = rule[2];
        const state1 = update(state);
        expect(state1.expression).toEqual(6);
    })
})

