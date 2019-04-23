import { map, some, none } from "../Option";

test(`inline lambda selectFirst from makePair`, () => {
    const double = (n: number): number => n * 2
    const len = (s: string): number => s.length

    expect(map(double, some(1))).toEqual({ tag: 'Some', value: 2 });
    expect(map(double, none)).toEqual({ tag: 'None' });
    expect(map(len, some('hello'))).toEqual({ tag: 'Some', value: 5 });
})

