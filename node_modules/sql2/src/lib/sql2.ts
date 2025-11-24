export type Interpolable = Statement | number | string | boolean | null;

const placeholder = Symbol();

function invariant(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

export class Statement {
  readonly strings: (string | typeof placeholder)[] = [];
  readonly values: Interpolable[] = [];

  constructor(strings: ReadonlyArray<string>, values: Interpolable[]) {
    invariant(
      values && strings.length - 1 === values.length,
      "Invalid number of values"
    );

    let givenStrings: (string | typeof placeholder)[] = [...strings];
    let givenValues: Interpolable[] = [...values];

    while (true) {
      if (givenStrings.length === 0 && givenValues.length === 0) break;
      if (givenStrings.length > 0) this.strings.push(givenStrings.shift()!);
      if (givenValues.length > 0) {
        const value = givenValues.shift()!;

        if (value instanceof Statement) {
          this.strings.push(...value.strings);
          this.values.push(...value.values);
        } else {
          this.strings.push(placeholder);
          this.values.push(value);
        }
      }
    }
  }

  parameterize(index: number) {
    return `$${index}`;
  }

  compile() {
    let result = "";
    let index = 1;

    for (let i = 0; i < this.strings.length; i++) {
      if (this.strings[i] === placeholder) {
        result += this.parameterize(index++);
      } else {
        result += this.strings[i] as string;
      }
    }

    return result;
  }
}

export interface Sql {
  (strings: TemplateStringsArray, ...values: Interpolable[]): Statement;
}

export function createSql<C extends Sql>(sqlClass: C) {
  return sqlClass;
}

type createSql<C extends Sql> = (sqlClass: C) => C;
