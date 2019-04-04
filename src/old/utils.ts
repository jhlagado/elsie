import { EvalExpression, Lambda, Closure, Definition, Application, Identifier } from "./elements";
import { grammar } from "./grammar";
import { semantics } from "./semantics";

export function stringify(value: any) {
  return value == null ?
    'null' :
    typeof value === 'symbol' ?
      (value as any).description :
      value.toString();
}

export function evaluate(expr: EvalExpression, context: any): EvalExpression {
  if (Array.isArray(expr)) {
    return expr.reduce((_acc, item) => evaluate(item, context), null);
  }
  else if (expr instanceof Lambda) {
    return new Closure(expr, context);
  }
  else if (expr instanceof Definition) {
    const value = evaluate(expr.definition, context);
    if (value instanceof Closure)
      value.name = expr.name.value;
    context[expr.name.value] = value;
    return undefined; //void
  }
  else if (expr instanceof Application) {
    const closure = evaluate(expr.funcExpr, context);
    if (!(closure instanceof Closure)) {
      throw `expected function in left arg: ${
      expr} received: ${closure}`;
    }
    else {
      const argValue = evaluate(expr.argExpr, context);
      const argName: Identifier = closure.lambda.argName;
      const bodyExpr = closure.lambda.bodyExpr;
      const newContext = {
        ...closure.context,
        [argName.value]: argValue
      };
      return evaluate(bodyExpr, newContext);
    }
  }
  else if (expr instanceof Identifier) {
    if (context != null && expr.value in context) {
      return context[expr.value];
    }
    else {
      throw `Unknown identifier ${
      expr.value}`;
    }
  }
  else {
    return expr;
  }
}

export function parse(text: string):EvalExpression {
  const matchResult = grammar.match(text);
  if (matchResult.failed()) {
    throw matchResult.message;
  }
  const adapter = semantics(matchResult);
  return adapter.parse();
}
