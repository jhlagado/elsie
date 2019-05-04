import { Num, Str } from "../constructors";
import { add, inc3 } from "../functions";
import { run, enter } from "../utils";
import { apply } from "../continuations";
import { initialise, state } from "../state";

describe(`run numbers`, () => {

    it(`should work with numbers`, () => {

        initialise();

        run(enter(Num(123), [], apply));
        expect(state.RVal).toBe(123);

        run(enter(add, [Num(7), Num(6)], apply));
        expect(state.RVal).toBe(13);

        run(enter(inc3, [Num(21)], apply));
        expect(state.RVal).toBe(24);

    })

    it(`should build a string`, () => {

        initialise();

        run(enter(Str('abc'), [], apply));
        expect(String.fromCharCode(state.args[0])).toBe('a');

        run(enter(state.args[1], [], apply));
        expect(String.fromCharCode(state.args[0])).toBe('b');

        run(enter(state.args[1], [], apply));
        expect(String.fromCharCode(state.args[0])).toBe('c');
    })

});