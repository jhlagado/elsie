import { parseEval } from "../evaluate";
import { stringify } from "../utils";

const context = {};

parseEval(`
  def identity x = x;
  def apply func arg = func arg;
  def selfApply s = s s;
  def selectFirst first second = first;
  def selectSecond first second = second;
  def makePair first second func = func first second;
  def cond thenExpr elseExpr predicate = predicate thenExpr elseExpr;
  def true = selectFirst;
  def false = selectSecond;
  def not predicate = cond false true predicate;
  def and x y = cond y false x;
  def or x y = cond true y x;
  def iff predicate thenExpr elseExpr =
    cond thenExpr elseExpr predicate;
`, context);

test(`inline lambda selectFirst from makePair`, () => {
    const actual = stringify(parseEval(
        `(((#first.#second.#f.((f first) second) #x.x) #y.y) #first.#second.first)`,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply   `, () => {
    const actual = stringify(parseEval(
        `
        let
            test x = iff x #x.x #y.y;
        in
            (test false)
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`open apply   `, () => {
    const actual = stringify(parseEval(
        `
        let
            test x = iff x #x.x #y.y;
        in
            (test true)
        `,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply   `, () => {
    const actual = stringify(parseEval(
        `
        selfApply #x.x
        `,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply   `, () => {
    const actual = stringify(parseEval(
        `
        let
            i = #x.x;
            j = identity;
        in (identity j)
        `,
        context,
    ));
    const expected = `identity`;
    expect(actual).toEqual(expected);
})

test(`or one true   `, () => {
    const actual = stringify(parseEval(
        `
        (or false true)
        `,
        context,
    ));
    const expected = `true`;
    expect(actual).toEqual(expected);
})

test(`or both false   `, () => {
    const actual = stringify(parseEval(
        `
        (or false false)
        `,
        context,
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`and one false   `, () => {
    const actual = stringify(parseEval(
        `
        (and false true)
        `,
        context,
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`and both true   `, () => {
    const actual = stringify(parseEval(
        `
        (and true true)
        `,
        context,
    ));
    const expected = `true`;
    expect(actual).toEqual(expected);
})

test(`not not expression   `, () => {
    const actual = stringify(parseEval(
        `
        (not (not false))
        `,
        context,
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`identity applied to itself is identity   `, () => {
    const actual = stringify(parseEval(
        `
        (#x.x #x.x)
        `,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`curried apply   `, () => {
    const actual = stringify(parseEval(
        `
        ((makePair #x.x #y.y) selectSecond)
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`check let with args   `, () => {
    const actual = stringify(parseEval(
        `
        let
            identity2 = #x.x;
        in
            identity2 #y.y
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`check def with args   `, () => {
    const actual = stringify(parseEval(
        `
        def x f = f;
        x
        `,
        context,
    ));
    const expected = `x`;
    expect(actual).toEqual(expected);
})

test(`check shadow variables   `, () => {
    const actual = stringify(parseEval(
        `
        (#f.(f #f.f) selfApply)
        `,
        context,
    ));
    const expected = `#f.f`;
    expect(actual).toEqual(expected);
})

test(`make pair and select second   `, () => {
    const actual = stringify(parseEval(
        `
        let
            pair = (makePair #x.x #y.y);
        in
            (pair selectSecond)
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`make pair and select first   `, () => {
    const actual = stringify(parseEval(
        `
        let
            pair = (makePair #x.x #y.y);
        in
            (pair selectFirst)
        `,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`check context   `, () => {
    const actual = stringify(parseEval(
        `identity`,
        context,
    ));
    const expected = `identity`;
    expect(actual).toEqual(expected);
})

test(`let expression   `, () => {
    const actual = stringify(parseEval(
        `
        let
            selectFirst x y = x;
        in
            (selectFirst #y.y #x.x)
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`select first arg   `, () => {
    const actual = stringify(parseEval(
        `
        ((#first.#second.first #x.x) #y.y)
        `,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`let expression   `, () => {
    const actual = stringify(parseEval(
        `
        let
            i = #x.x;
            j = #y.y;
        in (i j)
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`defining in context   `, () => {
    const actual = stringify(parseEval(
        `
        def i x = x;
        (i #y.y)
        `,
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`closure apply ident to ident   `, () => {
    const actual = stringify(parseEval(
        `
        ((#func.#arg.(func arg) #x.x) #x.x)
        `,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`closure apply ident to self apply   `, () => {
    const actual = stringify(parseEval(
        `((#func.#arg.(func arg) #x.x) #s.(s s))`,
        context,
    ));
    const expected = `#s.(s s)`;
    expect(actual).toEqual(expected);
})

test(`self apply identity to identity   `, () => {
    const actual = stringify(parseEval(
        `(#s.(s s) #x.x)`,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`applying identity to identity returns identity   `, () => {
    const actual = stringify(parseEval(
        `(#x.x #x.x)`,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`lambda evaluates to itself   `, () => {
    const actual = stringify(parseEval(
        `#x.x`,
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`empty   `, () => {
    const actual = stringify(parseEval(
        ``,
        context,
    ));
    const expected = `null`;
    expect(actual).toEqual(expected);
})
