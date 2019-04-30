import { Rule, WILD_CARD, State } from "./types";
import { CaseConsReducer, LetReducer } from "./reducers";

//             expr                       stack           Heap                    =>  expr                        stack           Heap
// ===============================================================================================================================================
// LET         let(x,obj,e)               s               H                           e[x'/x]                     s               H[x' -> obj]
// CASECON     case(v) of C x1 ... xn,e   s               H[v -> CON(C a1 ... an)]    e[a1/x1...a/ax]             s               H
// CASEANY     case(v) of x,e             s               H                           e[v/x]                      s               H
// CASE        case(e)                    s               H                           e                           case(.):s       H
// RET         ident v                    case(.):s       H                           case(v) CASECON CASEANY     s               H
// THUNK       ident x                    s               H[x -> THUNK e]             e                           Upd x .:s       H[x -> BLACKHOLE]
// UPDATE      ident y                    Upd x .:s       H                           y                           s               H[x -> H[y]]
// KNOWNCALL   fn a1...an                 s               H[f -> FUN(x1...xn,e)]      e[a1/x1...an/xn]            s               H
// PRIMOP      +  a1...an                 s               H                           a                           s               H
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
                WILD_CARD,
                WILD_CARD,
            ],
            WILD_CARD,
        ],
        LetReducer,
    ],
    ['Rule',
        ['Pattern',
            ['CaseCons',
                WILD_CARD,
                WILD_CARD,
                WILD_CARD,
            ],
            WILD_CARD,
        ],
        CaseConsReducer,
    ],
    ['Rule',
        ['Pattern',
            ['Ident', 'v'],
            undefined,
        ],
        (state: State): State => state,
    ],
];

