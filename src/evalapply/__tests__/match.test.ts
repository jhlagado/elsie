import { matchAtom, matchPattern } from "../match";
import { Tuple, WILD_CARD } from "../types";

describe(`match pattern item with`, () => {

    it(`should match the exact string item in 0 and the atomic type spec for the following items`, () => {
        expect(matchAtom('Test', 'Test', 0)).toBe(true);
        expect(matchAtom('test', 'string', 1)).toBe(true);
        expect(matchAtom(1, 'x', 1)).toBe(false);
        expect(matchAtom(1, 'number', 1)).toBe(true);
    })

    test(`should match the simple tuple with the pattern spec`, () => {
        const tuple1: Tuple = ['Test', 1, 'x', Symbol.for('z')];
        const tuple2: Tuple = ['Test', 'number', 'string', 'symbol'];
        expect(matchPattern(tuple1, tuple2)).toBe(true);
    })

    test(`should match the nested tuple with the pattern spec`, () => {
        const tuple1: Tuple = ['Let', 'x', ['Add', 'a', 'b'], ['Apply', 'i', 'j']];
        const tuple2: Tuple = ['Let', 'string', ['Add', 'string', 'string'], ['Apply', 'string', 'string']];
        expect(matchPattern(tuple1, tuple2)).toBe(true);
    })

    test(`should wild-card match the nested tuple with the pattern spec`, () => {
        const tuple1: Tuple = ['Let', 'x', ['Add', 'a', 'b'], ['Apply', 'i', 'j']];
        const tuple2a: Tuple = ['Let', WILD_CARD, ['Add', 'string', 'string'], ['Apply', 'string', 'string']];
        expect(matchPattern(tuple1, tuple2a)).toBe(true);
        const tuple2b: Tuple = ['Let', 'string', WILD_CARD, ['Apply', 'string', 'string']];
        expect(matchPattern(tuple1, tuple2b)).toBe(true);
        const tuple2c: Tuple = ['Let', 'string', ['Add', 'string', 'string'], WILD_CARD];
        expect(matchPattern(tuple1, tuple2c)).toBe(true);
    })

})

