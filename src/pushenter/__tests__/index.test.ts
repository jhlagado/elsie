import { Num, Str } from '../constructors';
import { add, inc3 } from '../functions';
import { run, enter, charCode, checkValue } from '../utils';
import { apply } from '../continuations';
import { initialise, state } from '../state';

describe(`run numbers`, () => {

    it(`should work with numbers`, () => {

        initialise();

        run(state, enter(state, Num(123), [], apply));
        expect(state.currentValue).toBe(123);

        run(state, enter(state, add, [Num(7), Num(6)], apply));
        expect(state.currentValue).toBe(13);

        run(state, enter(state, inc3, [Num(21)], apply));
        expect(state.currentValue).toBe(24);

    })

    it(`should build a string`, () => {

        initialise();
        run(state, enter(state, Str([...'abc']), [], apply));
        expect(checkValue(state, state.args[0])).toBe(charCode('a'));

        run(state, enter(state, state.args[1], [], apply));
        expect(checkValue(state, state.args[0])).toBe(charCode('b'));

        run(state, enter(state, state.args[1], [], apply));
        expect(checkValue(state, state.args[0])).toBe(charCode('c'));
    })

});