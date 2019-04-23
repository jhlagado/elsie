type Program = Assign[];

interface Assign {
    ident: Identifier;
    value: HeapObject;
}

type Atom = Literal | Identifier;
type Identifier = string;
type Literal = string | number;

type DataExprKind = 'String' | 'Number' | 'Boolean' | 'Array' | 'Record';

type HigherExprKind = 'FuncExpr' | 'LetExpr' | 'CaseExpr';

const Literal = (value: string | number | boolean) => ({
    kind: typeof value,
    value,
});

// interface DataExpr extends Expr {
//     kind: DataExprKind;
// }

// interface HigherExpr extends Expr {
//     kind: HigherExprKind;
// }

// interface FuncExpr extends HigherExpr {
//     kind: 'FuncExpr';
//     ident: Identifier;
//     args: Expr[],
// }

// interface LetExpr extends HigherExpr {
//     kind: 'LetExpr';
//     ident: Identifier;
//     value: Expr;
//     expr: Expr;
// }

// interface CaseExpr extends HigherExpr {
//     kind: 'CaseExpr';
//     scrutineer: Expr;
//     alts: Alternate[];
// }

// interface Alternate {
//     pattern: Cons | Literal;
//     expr: Expr;
// }

// interface Cons {
//     ident: Identifier;
//     args: Expr[],
// }

// // stack object
// // works with the current expression

// type StackObject = Update | Apply | Case

// interface Update {
//     kind: 'Update';
//     ident: Identifier;
// }

// interface Apply {
//     kind: 'Apply';
//     args: Expr[],
// }

// interface Case {
//     kind: 'Case';
//     clauses: Alternate[];
// }

// //heap objects

// type HeapObject = FUN | PAP | CON | THUNK | Literal | symbol | null;

// interface FUN {
//     kind: 'FUN';
//     params: Identifier[];
//     expr: Expr;
// }

// interface PAP {
//     kind: 'PAP';
//     ident: Identifier;
//     expr: Expr[];
// }

// interface CON {
//     kind: 'CON';
//     ident: Identifier;
//     expr: Expr[];
// }

// interface THUNK {
//     kind: 'THUNK';
//     ident: Identifier;
//     expr: Expr[];
// }

