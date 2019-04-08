import { semantics } from "./semantics";
import {
  EvalExpression, Lambda, Closure, Definition,
  Application, Identifier
} from "./elements";
import { Grammar } from "ohm-js";

export const parseWith = (grammar:Grammar) => (text: string):EvalExpression => {
  const matchResult = grammar.match(text);
  if (matchResult.failed()) {
    throw matchResult.message;
  }
  const adapter = semantics(matchResult);
  return adapter.parse();
}

export const evaluate = (context: any, expr: EvalExpression): EvalExpression => {
  if (Array.isArray(expr)) {
    return expr.reduce((_acc, item) => evaluate(context, item), null);
  }
  else if (expr instanceof Lambda) {
    return new Closure(expr, context);
  }
  else if (expr instanceof Definition) {
    const value = evaluate(context, expr.definition);
    if (value instanceof Closure)
      value.name = expr.name.value;
    context[expr.name.value] = value;
    return undefined; //void
  }
  else if (expr instanceof Application) {
    const closure = evaluate(context, expr.funcExpr);
    if (!(closure instanceof Closure)) {
      throw `expected function in left arg: ${
      expr} received: ${closure}`;
    }
    else {
      const argValue = evaluate(context, expr.argExpr);
      const argName: Identifier = closure.lambda.argName;
      const bodyExpr = closure.lambda.bodyExpr;
      const newContext = {
        ...closure.context,
        [argName.value]: argValue
      };
      return evaluate(newContext, bodyExpr);
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

export function format(value: any) {
  return value == null ?
    'null' :
    typeof value === 'symbol' ?
      (value as any).description :
      value.toString();
}
