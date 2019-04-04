import { format, parse, evaluate } from "../utils";

const context = {};

format(evaluate(parse(`
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
`), context));

test(`inline lambda selectFirst from makePair`, () => {
    const actual = format(evaluate(parse(
        `(((#first.#second.#f.((f first) second) #x.x) #y.y) #first.#second.first)`),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(evaluate(parse(
        `
        let
            test x = iff x #x.x #y.y;
        in
            (test false)
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(evaluate(parse(
        `
        let
            test x = iff x #x.x #y.y;
        in
            (test true)
        `),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(evaluate(parse(
        `
        selfApply #x.x
        `),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(evaluate(parse(
        `
        let
            i = #x.x;
            j = identity;
        in (identity j)
        `),
        context,
    ));
    const expected = `identity`;
    expect(actual).toEqual(expected);
})

test(`or one true`, () => {
    const actual = format(evaluate(parse(
        `
        (or false true)
        `),
        context,
    ));
    const expected = `true`;
    expect(actual).toEqual(expected);
})

test(`or both false`, () => {
    const actual = format(evaluate(parse(
        `
        (or false false)
        `),
        context,
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`and one false`, () => {
    const actual = format(evaluate(parse(
        `
        (and false true)
        `),
        context,
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`and both true`, () => {
    const actual = format(evaluate(parse(
        `
        (and true true)
        `),
        context,
    ));
    const expected = `true`;
    expect(actual).toEqual(expected);
})

test(`not not expression`, () => {
    const actual = format(evaluate(parse(
        `
        (not (not false))
        `),
        context,
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`identity applied to itself is identity`, () => {
    const actual = format(evaluate(parse(
        `
        (#x.x #x.x)
        `),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`curried apply`, () => {
    const actual = format(evaluate(parse(
        `
        ((makePair #x.x #y.y) selectSecond)
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`check let with args`, () => {
    const actual = format(evaluate(parse(
        `
        let
            identity2 = #x.x;
        in
            identity2 #y.y
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`check def with args`, () => {
    const actual = format(evaluate(parse(
        `
        def x f = f;
        x
        `),
        context,
    ));
    const expected = `x`;
    expect(actual).toEqual(expected);
})

test(`check shadow variables`, () => {
    const actual = format(evaluate(parse(
        `
        (#f.(f #f.f) selfApply)
        `),
        context,
    ));
    const expected = `#f.f`;
    expect(actual).toEqual(expected);
})

test(`make pair and select second`, () => {
    const actual = format(evaluate(parse(
        `
        let
            pair = (makePair #x.x #y.y);
        in
            (pair selectSecond)
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`make pair and select first`, () => {
    const actual = format(evaluate(parse(
        `
        let
            pair = (makePair #x.x #y.y);
        in
            (pair selectFirst)
        `),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`check context`, () => {
    const actual = format(evaluate(parse(
        `identity`),
        context,
    ));
    const expected = `identity`;
    expect(actual).toEqual(expected);
})

test(`let expression`, () => {
    const actual = format(evaluate(parse(
        `
        let
            selectFirst x y = x;
        in
            (selectFirst #y.y #x.x)
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`select first arg`, () => {
    const actual = format(evaluate(parse(
        `
        ((#first.#second.first #x.x) #y.y)
        `),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`let expression`, () => {
    const actual = format(evaluate(parse(
        `
        let
            i = #x.x;
            j = #y.y;
        in (i j)
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`defining in context`, () => {
    const actual = format(evaluate(parse(
        `
        def i x = x;
        (i #y.y)
        `),
        context,
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`closure apply ident to ident`, () => {
    const actual = format(evaluate(parse(
        `
        ((#func.#arg.(func arg) #x.x) #x.x)
        `),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`closure apply ident to self apply`, () => {
    const actual = format(evaluate(parse(
        `((#func.#arg.(func arg) #x.x) #s.(s s))`),
        context,
    ));
    const expected = `#s.(s s)`;
    expect(actual).toEqual(expected);
})

test(`self apply identity to identity`, () => {
    const actual = format(evaluate(parse(
        `(#s.(s s) #x.x)`),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`applying identity to identity returns identity`, () => {
    const actual = format(evaluate(parse(
        `(#x.x #x.x)`),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`lambda evaluates to itself`, () => {
    const actual = format(evaluate(parse(
        `#x.x`),
        context,
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`empty`, () => {
    const actual = format(evaluate(parse(
        ``),
        context,
    ));
    const expected = `null`;
    expect(actual).toEqual(expected);
})
