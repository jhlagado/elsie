export function stringify(value: any) {
  return value == null ?
    'null' :
    typeof value === 'symbol' ?
      (value as any).description :
      value.toString();
}

// function assert(text: string, expected: string, message: string, postProcess = stringify) {
//   let result = parseEval(text, {...globalContext});
//   if (result === undefined)
//     throw 'Undefined';
//   else {
//     const actual = postProcess(result);
//     if (actual === expected)
//       console.log('Success!');
//     else {
//       throw `${message}
//       ${text}
//       expected:${expected} actual:${actual}
//       `;
//     }
//   }
// }

