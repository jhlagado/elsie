
//             expr                       stack           Heap                    =>  expr                        stack           Heap
// ===============================================================================================================================================
// LET         let(x,obj,e)               s               H                           e[x'/x]                     s               H[x' -> obj]
// CASECON     case(v) of C x1 ... xn,e   s               H[v -> CON(C a1 ... an)]    e[a1/x1]                    s               H
// CASEANY     case(v) of x,e             s               H                           e[v/x]                      s               H
// CASE        case(e)                    s               H                           e                           case(.):s       H
// RET         ident v                    case(.):s       H                           case(v) CASECON CASEANY     s               H
// THUNK       ident x                    s               H[x -> THUNK e]             e                           Upd x .:s       H[x -> BLACKHOLE]
// UPDATE      ident y                    Upd x .:s       H                           y                           s               H[x -> H[y]]
// KNOWNCALL   fn a1...an                 s               H[f -> FUN(x1...xn,e)]      e[a1/x1...an/xn]            s               H
// PRIMOP      +  a1...an                 s               H                           a1                          s               H
// EXACT       f. a1...an                 s               H[f -> FUN(x1..xn,e)]       e[a1/x1...an/xn]            s               H
// CALLK       fk a1...am                 s               H[f -> FUN(x1..xn,e)]       e[a1/x1...an/xn]            (. an+1...am):s H
// PAP2        fk a1...am                 s               H[f -> FUN(x1..xn,e)]       p                           s               H[p -> PAP(f a1...am)]
// TCALL       f. a1...am                 s               H[f -> THUNK e]             f                           (. a1...am)     H
// PCALL       fk an+1...am               s               H[p -> PAP(g a1...an)]      g. a1...an an+1...am        s               H
// RETFUN      ident f                    (. a1...an):s   H                           f. a1...an                  s               H

interface State {
    expression: Tuple;
    stack: StackObject[];
    heap: HeapObject[];
    globals: { [key: string]: number };
}

const alloc = (state: State, object: HeapObject): number => {
    const ptr = state.heap.length - 1;
    state.heap[ptr] = object;
    return ptr;
}

type StackObject = any;
type HeapObject = any;

//type Dict = { [key: string]: any }

type StateUpdate = (state: State) => State;

type Tuple = [string, ...any[]];
type Pattern = ['Pattern', any, any, any];
type Rule = ['Rule', Pattern, StateUpdate];
// type Apply = ['Apply', Dict, Expr];
// type Ident = ['Ident', string];
// type Let = ['Let', string, HeapObject, string];
// type Expr = Ident | Let;

function isString(obj: any): obj is string {
    return Object.prototype.toString.call(obj) === "[object String]"
}

function isTuple(obj: any): obj is Tuple {
    return obj.length > 0 && isString(obj[0]);
}

const t: Rule[] = [
    ['Rule',
        ['Pattern',
            ['Let',
                ['Ident',
                    'x'
                ],
                'obj',
                'e'
            ],
            'stack',
            'heap'
        ],
        (state: State): State => {
            const { expression } = state;
            const [_, ident, obj, expr] = expression;
            const id = alloc(state, obj);
            state.expression = ['Apply', { [ident]: id }, expr];
            return state;
        },
    ],
    ['Rule',
        ['Pattern',
            ['Ident', 'v'],
            'stack',
            'heap'
        ],
        (state: State): State => {
            const { expression } = state;
            const [_, ident, obj, expr] = expression;
            const id = alloc(state, obj);
            state.expression = ['Apply', { [ident]: id }, expr];
            return state;
        }
    ],
];

const matchPattern = (expression: Tuple, pattern: Pattern) => {
    if (isTuple(expression)) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        matchTuple(expression, pattern)
    }

    if (expression.length === pattern.length) {
        expression
    }
    return false;
}

const matchTuple = (tuple1: Tuple, tuple2: Tuple) => {
    if (tuple1.length !== tuple2.length) return false;
    return tuple1.every((item1, index) => {
        return index === 0 ?
            item1 === tuple2[index] :
            matchPattern(item1, tuple2[index]);
    })
}

const _matchTransition = (state: State) => {
    for (const rule of t) {
        if (matchTuple(state.expression, rule[1])) {
            return rule;
        }
    }
};

// const state: State = {
//     expression: Nil,
//     stack: [],
//     heap: [],
//     globals: {},
// }

// const stackPush = (state: State, object: StackObject) => {
//     state.stack[state.stack.length - 1] = object;
//     return object;
// }

// const stackPop = (state: State, ): StackObject => {
//     const object = state.stack[state.stack.length - 1];
//     state.stack.length--;
//     return object;
// }

// const dealloc = (state: State, address: number) => {
//     const object = state.heap[address];
//     state.heap[address] = null;
//     return object;
// }

// const execute = (state: State, program: Program) => {
//     for (const assign of program) {
//         state.globals[assign.ident] = alloc(state, assign.value)
//     }
//     state.expression = program[program.length - 1].ident;
//     evaluate();
// }

// const evaluate = () => {
//     return 1 + 1;
// }

// execute(state, [
//     { ident: 'x', value: 1 },
//     { ident: 'y', value: 1 },
//     {
//         ident: 'main', value: {
//             kind: 'FUN',
//             params: ['x', 'y'],
//             expr: 3,
//         }
//     },
// ]);