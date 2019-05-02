
export function stringify(value) {
    return value === null ?
        'null' :
        typeof value === 'symbol' ?
            (value as any).description :
            value.toString();
}
