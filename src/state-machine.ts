// Programs        prog ::= f1 = obj1; ... ; fn = objn

// Heap objects    obj ::= FUN (x1 ... xn -> e)            Function (arity = n  1)
//                     | PAP(f a1 ... an)                  Partial appliation (f is always a
//                                                         FUN with arity(f ) > n >= 1)
//                     | CON (C a1 ... an)                 Saturated construtor (n >= 0)
//                     | THUNK e                           Thunk
//                     | BLACKHOLE                         only during evaluation℄

// Alternatives    alt ::= C x1 ... xn -> e                (n  0)
//                     | x -> e                            Default alternative

// Expressions     e ::= a                                 Atom
//                     | fk a1 ... an                      Funtion all (n >= 1)
//                     | (+) a1 ... an                     Saturated primitive operation (n >= 1)
//                     | let x = obj in e
//                     | case e of {alt1; ... ; altn}      (n >= 1)

// Variables       x, y, f, g
// Construtors     C                                       Defined in data type delarations
// Literals        lit ::= i | d                           Unboxed integer or double
// Atoms           a, v ::= lit | x                        Function arguments are atomi
// Funtion arity   k ::= (.)                               Unknown arity
//                     | n                                 Known arity n > 1

type Program = Assign[];

interface Assign {
    ident: Identifier;
    expr: Expr;
}

type Expr = Atom | FuncExpr | LetExpr | CaseExpr;

type Atom = Literal | Identifier;
type Identifier = string;
type Literal = string | number;

interface FuncExpr {
    kind: 'FuncExpr';
    ident: Identifier;
    args: Expr[],
}

interface LetExpr {
    kind: 'LetExpr';
    ident: Identifier;
    value: Expr;
    expr: Expr;
}

interface CaseExpr {
    kind: 'CaseExpr';
    scrutineer: Expr;
    alts: Alternate[];
}

interface Alternate {
    pattern: Cons | Literal;
    expr: Expr;
}

interface Cons {
    ident: Identifier;
    args: Expr[],
}

// stack object
// works with the current expression

type StackObject = Update | Apply | Case

interface Update {
    kind: 'Update';
    ident: Identifier;
}

interface Apply {
    kind: 'Apply';
    args: Expr[],
}

interface Case {
    kind: 'Case';
    clauses: Alternate[];
}

//heap objects

type HeapObject = FUN | PAP | CON | THUNK | symbol;

interface FUN {
    kind: 'FUN';
    expr: Expr[];
}

interface PAP {
    kind: 'PAP';
    expr: Expr[];
}

interface CON {
    kind: 'CON';
    expr: Expr[];
}

interface THUNK {
    kind: 'THUNK';
    expr: Expr[];
}

const BLACKHOLE: symbol = Symbol('BLACKHOLE');
const Nil: symbol = Symbol('Nil');

let expression: Expr = 0;
let stack: StackObject[] = [];
let heap: HeapObject[] = [];
const program: Program = [];

program; BLACKHOLE; Nil; expression; stack; heap;
