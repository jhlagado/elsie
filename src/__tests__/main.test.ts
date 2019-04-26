import { Tuple, isTuple, Rule } from "../types";
import { matchRule } from "../main";

describe(`match rules`, () => {

    it(`should match the rule`, () => {
        const code: Tuple = ['Let', 'x', ['Literal', 3], ['Add', 'x', 'x']];
        const rule: Rule | undefined = matchRule(code);
        expect(rule).toBeDefined();
        if (!rule) return;
        expect(isTuple(rule[1][1], 'Let')).toBe(true);
    })
})

