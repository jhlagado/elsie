import { run, enterClosure, apply, state } from "../STG";
import { Num, Str } from "../constructors";
import { add, inc3 } from "../tools";

describe(`match rules`, () => {

    it(`should match the rule`, () => {

        run(enterClosure(Num(123), [], apply));
        expect(state.RVal).toBe(123);

        run(enterClosure(add, [Num(7), Num(6)], apply));
        expect(state.RVal).toBe(13);

        run(enterClosure(inc3, [Num(21)], apply));
        expect(state.RVal).toBe(24);

        run(enterClosure(Str('abc'), [], apply));
        expect(String.fromCharCode(state.args[0])).toBe('a');

        run(enterClosure(state.args[1], [], apply));
        expect(String.fromCharCode(state.args[0])).toBe('b');

        run(enterClosure(state.args[1], [], apply));
        expect(String.fromCharCode(state.args[0])).toBe('c');
    })
});