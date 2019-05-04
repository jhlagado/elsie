import { format } from './utils';

export type Expression = Lambda | Identifier | Application;
export type EvalExpression = Expression | Closure | undefined;

export class Lambda {

  argName: Identifier;
  bodyExpr: Expression;

  constructor(
    argName: Identifier,
    bodyExpr: Expression,
  ) {
    this.argName = argName;
    this.bodyExpr = bodyExpr;
  }

  toString() {
    return `#${this.argName}.${
      format(this.bodyExpr)
    }`;
  }
}

export class Identifier {

  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export class Application {

  funcExpr: Expression;
  argExpr: Expression;

  constructor(
    funcExpr: Expression,
    argExpr: Expression,
  ) {
    this.funcExpr = funcExpr;
    this.argExpr = argExpr;
  }

  toString() {
    return `(${format(this.funcExpr)
      } ${format(this.argExpr)})`;
  }
}

export class Definition {
  name: Identifier;
  definition: Expression;

  constructor(name: Identifier, definition: Expression) {
    this.name = name;
    this.definition = definition;
  }

  toString() {
    return `${this.name} = ${this.definition}`
  }
}

export class Closure {
  name?: string;
  lambda: Lambda;
  context: any;

  constructor(lambda: Lambda, context: any) {
    this.lambda = lambda;
    this.context = context;
  }

  toString() {
    return `${this.name ? this.name : this.lambda}`
  }
}

