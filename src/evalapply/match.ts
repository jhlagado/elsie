import { Atom, isWildCard, isTuple, Tuple, WildCard } from "./types";

export type AtomMatcher = (atom1: Atom, atom2: Atom, _index: number) => boolean;

export const matchItemWith = (
    atomMatcher: AtomMatcher,
    item: any,
    patternItem: any,
    index: number
): boolean =>
    isWildCard(patternItem) ? true :
        isTuple(item) ?
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            (isTuple(patternItem) ? matchTupleWith(atomMatcher)(item, patternItem) : false) :
            atomMatcher(item, patternItem, index);

export const matchTupleWith = (match: AtomMatcher) =>
    (tuple: Tuple, patternTuple: Tuple | WildCard): boolean =>
        isWildCard(patternTuple) ? true :
            (tuple.length !== patternTuple.length) ? false :
                tuple.every((item1, index) =>
                    matchItemWith(match, item1, patternTuple[index], index));

export const matchAtom = (atom1: Atom, atom2: Atom, index: number) =>
    index === 0 ? atom1 === atom2 : typeof atom1 === atom2;

export const matchPattern = matchTupleWith(matchAtom);
