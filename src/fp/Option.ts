declare module './HKT' {
    interface URI2HKT<A> {
        Option: Option<A> // maps the type literal "Option" to the type `Option`
    }
}

export const URI = 'Option'

export type URI = typeof URI

export class None<A> {
    readonly _URI!: URI
    readonly _A!: never
    readonly tag: 'None' = 'None'
    map<B>(_f: (a: A) => B): Option<B> {
        return none
    }
}

export class Some<A> {
    readonly _URI!: URI
    readonly _A!: A
    readonly tag: 'Some' = 'Some'
    constructor(readonly value: A) {}
    map<B>(f: (a: A) => B): Option<B> {
        return some(f(this.value))
    }
}

export type Option<A> = None<A> | Some<A>

export const none: Option<never> = new None()

export const some = <A>(a: A): Option<A> => {
    return new Some(a)
}

export const map = <A, B>(f: (a: A) => B, fa: Option<A>) => {
    return fa.map(f)
}
