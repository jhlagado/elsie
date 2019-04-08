import { elsieGrammar } from "../grammar";
import { format, parseWith, evaluate } from "../utils";

const context = {};
const parse = parseWith(elsieGrammar);
const parseEval = (text: string) => evaluate(context, parse(text));

format(parseEval(`
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
`));

test(`inline lambda selectFirst from makePair`, () => {
    const actual = format(parseEval(
        `(((#first.#second.#f.((f first) second) #x.x) #y.y) #first.#second.first)`),
    );
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(parseEval(
        `
        let
            test x = iff x #x.x #y.y;
        in
            (test false)
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(parseEval(
        `
        let
            test x = iff x #x.x #y.y;
        in
            (test true)
        `
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(parseEval(
        `
        selfApply #x.x
        `
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`open apply`, () => {
    const actual = format(parseEval(
        `
        let
            i = #x.x;
            j = identity;
        in (identity j)
        `
    ));
    const expected = `identity`;
    expect(actual).toEqual(expected);
})

test(`or one true`, () => {
    const actual = format(parseEval(
        `
        (or false true)
        `
    ));
    const expected = `true`;
    expect(actual).toEqual(expected);
})
test(`or both false`, () => {
    const actual = format(parseEval(
        `
        (or false false)
        `
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`and one false`, () => {
    const actual = format(parseEval(
        `
        (and false true)
        `
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})
test(`and both true`, () => {
    const actual = format(parseEval(
        `
        (and true true)
        `
    ));
    const expected = `true`;
    expect(actual).toEqual(expected);
})

test(`not not expression`, () => {
    const actual = format(parseEval(
        `
        (not (not false))
        `
    ));
    const expected = `false`;
    expect(actual).toEqual(expected);
})

test(`identity applied to itself is identity`, () => {
    const actual = format(parseEval(
        `
        (#x.x #x.x)
        `
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`curried apply`, () => {
    const actual = format(parseEval(
        `
        ((makePair #x.x #y.y) selectSecond)
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`check let with args`, () => {
    const actual = format(parseEval(
        `
        let
            identity2 = #x.x;
        in
            identity2 #y.y
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`check def with args`, () => {
    const actual = format(parseEval(
        `
        def x f = f;
        x
        `
    ));
    const expected = `x`;
    expect(actual).toEqual(expected);
})

test(`check shadow variables`, () => {
    const actual = format(parseEval(
        `
        (#f.(f #f.f) selfApply)
        `
    ));
    const expected = `#f.f`;
    expect(actual).toEqual(expected);
})

test(`make pair and select second`, () => {
    const actual = format(parseEval(
        `
        let
            pair = (makePair #x.x #y.y);
        in
            (pair selectSecond)
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`make pair and select first`, () => {
    const actual = format(parseEval(
        `
        let
            pair = (makePair #x.x #y.y);
        in
            (pair selectFirst)
        `
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`check context`, () => {
    const actual = format(parseEval(
        `identity`
    ));
    const expected = `identity`;
    expect(actual).toEqual(expected);
})

test(`let expression`, () => {
    const actual = format(parseEval(
        `
        let
            selectFirst x y = x;
        in
            (selectFirst #y.y #x.x)
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`select first arg`, () => {
    const actual = format(parseEval(
        `
        ((#first.#second.first #x.x) #y.y)
        `
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`let expression`, () => {
    const actual = format(parseEval(
        `
        let
            i = #x.x;
            j = #y.y;
        in (i j)
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`defining in context`, () => {
    const actual = format(parseEval(
        `
        def i x = x;
        (i #y.y)
        `
    ));
    const expected = `#y.y`;
    expect(actual).toEqual(expected);
})

test(`closure apply ident to ident`, () => {
    const actual = format(parseEval(
        `
        ((#func.#arg.(func arg) #x.x) #x.x)
        `
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`closure apply ident to self apply`, () => {
    const actual = format(parseEval(
        `((#func.#arg.(func arg) #x.x) #s.(s s))`
    ));
    const expected = `#s.(s s)`;
    expect(actual).toEqual(expected);
})

test(`self apply identity to identity`, () => {
    const actual = format(parseEval(
        `(#s.(s s) #x.x)`
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`applying identity to identity returns identity`, () => {
    const actual = format(parseEval(
        `(#x.x #x.x)`
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`lambda evaluates to itself`, () => {
    const actual = format(parseEval(
        `#x.x`
    ));
    const expected = `#x.x`;
    expect(actual).toEqual(expected);
})

test(`empty`, () => {
    const actual = format(parseEval(
        ``
    ));
    const expected = `null`;
    expect(actual).toEqual(expected);
})
