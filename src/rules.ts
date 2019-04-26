import { Rule, WILD_CARD, State, isTuple } from "./types";
import { alloc, applyArgs } from "./state";

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

export const rules: Rule[] = [
    ['Rule',
        ['Pattern',
            ['Let',
                'string',
                WILD_CARD,
                WILD_CARD,
            ],
            undefined,
        ],
        (state: State): State => {
            const { expression } = state;
            const [_, ident, obj, expr] = expression;
            const id = alloc(state, obj);
            return {
                ...state,
                expression: applyArgs([ident], [id], expr),
            };
        },
    ],
    ['Rule',
        ['Pattern',
            ['CaseCons',
                WILD_CARD,
                WILD_CARD,
                WILD_CARD,
            ],
            undefined,
        ],
        (state: State): State => {
            const { expression, heap } = state;
            const [_, v, vars, expr] = expression;
            const values = (isTuple(v, 'Ident')) ? heap[v[1]] : v;
            return {
                ...state,
                expression: applyArgs(vars, values, expr),
            };
        },
    ],
    ['Rule',
        ['Pattern',
            ['Ident', 'v'],
            undefined,
        ],
        (state: State): State => {
            return state;
        },
    ],
];

