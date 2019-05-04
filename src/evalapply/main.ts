import { matchPattern } from "./match";
import { Tuple } from "./types";
import { rules } from "./rules";

//             expr                       stack           Heap                    =>  expr                        stack           Heap
// ===============================================================================================================================================
// LET         let(x,obj,e)               s               H                           e[x'/x]                     s               H[x' -> obj]
// CASECON     case(v) of C x1 ... xn,e   s               H[v -> CON(C a1 ... an)]    e[a1/x1...a/ax]                    s               H
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

export const matchRule = (tuple: Tuple) => {
    for (const rule of rules) {
        if (matchPattern(tuple, rule[1])) {
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