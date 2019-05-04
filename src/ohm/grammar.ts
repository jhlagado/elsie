import * as ohm from 'ohm-js';

export const elsieGrammar = ohm.grammar(`
ElsieGrammar {

  Program
    = (DefDefinition | Expression | Comment)*

  Definition
    = ident ident* "=" (OpenApplication | Expression) ";"

  DefDefinition
    = "def" Definition

  Expression =
  	Lambda
    | Application
    | IfExpression
    | LetExpression
    | ident

  Lambda
    = "#" ident "." Expression

  Application
    = "(" Expression Expression+ ")"

  OpenApplication
    = Expression Expression+

  IfExpression
    = "if" Expression "then" Expression "else" Expression

  LetExpression
    = "let" Definition+ "in" Expression

  Comment
    = "--" any* #"\\n"

  ident  (an identifier)
    = (letter | "_") (alnum | "_")*


}`);
