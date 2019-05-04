import { Num, Str } from "../constructors";
import { add, inc3 } from "../functions";
import { run, enter, charCode, checkValue } from "../utils";
import { apply } from "../continuations";
import { initialise, state } from "../state";

describe(`run numbers`, () => {

    it(`should work with numbers`, () => {

        initialise();

        run(enter(Num(123), [], apply));
        expect(state.currentValue).toBe(123);

        run(enter(add, [Num(7), Num(6)], apply));
        expect(state.currentValue).toBe(13);

        run(enter(inc3, [Num(21)], apply));
        expect(state.currentValue).toBe(24);

    })

    it(`should build a string`, () => {

        initialise();
        run(enter(Str([...'abc']), [], apply));
        expect(checkValue(state.args[0])).toBe(charCode('a'));

        run(enter(state.args[1], [], apply));
        expect(checkValue(state.args[0])).toBe(charCode('b'));

        run(enter(state.args[1], [], apply));
        expect(checkValue(state.args[0])).toBe(charCode('c'));
    })

});