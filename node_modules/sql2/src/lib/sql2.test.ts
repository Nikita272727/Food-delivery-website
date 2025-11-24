import * as assert from "node:assert";
import { it } from "node:test";
import { Statement, type Interpolable } from "./sql2.ts";

function enforceType<U>(_value: U) {}

it("compiles without values", () => {
  const sql = (strings: TemplateStringsArray, ...values: Interpolable[]) =>
    new Statement(strings, values);

  assert.strictEqual(sql`select 1`.compile(), "select 1");
});

it("compiles with values", () => {
  const sql = (strings: TemplateStringsArray, ...values: Interpolable[]) =>
    new Statement(strings, values);

  const statement = sql`select ${1}`;
  assert.strictEqual(statement.compile(), "select $1");
  assert.deepStrictEqual(statement.values, [1]);
});

it("compiles with nested values", () => {
  const sql = (strings: TemplateStringsArray, ...values: Interpolable[]) =>
    new Statement(strings, values);

  const statement = sql`select exists (${sql`select * from table where id = ${"abc"}`}) and ${true}`;

  assert.strictEqual(
    statement.compile(),
    "select exists (select * from table where id = $1) and $2"
  );
  assert.deepStrictEqual(statement.values, ["abc", true]);
});

it("allows extending the statement class", () => {
  class CustomStatement extends Statement {
    query() {
      return [this.compile(), this.values];
    }
    parameterize(index: number) {
      return `:${index}`;
    }
  }

  const sql = (strings: TemplateStringsArray, ...values: Interpolable[]) =>
    new CustomStatement(strings, values);

  const statement = sql`select exists (${sql`select * from table where id = ${"abc"}`}) and ${true}`;

  assert.deepStrictEqual(statement.query(), [
    "select exists (select * from table where id = :1) and :2",
    ["abc", true],
  ]);
});

it("allows extending the statement class to implement PromiseLike", async () => {
  class CustomStatement<T> extends Statement implements PromiseLike<T[]> {
    then<TResult1 = T[], TResult2 = never>(
      onfulfilled?: (value: T[]) => PromiseLike<TResult1>,
      onrejected?: (reason: any) => PromiseLike<TResult2>
    ): PromiseLike<TResult1 | TResult2> {
      return Promise.resolve<T[]>([{ a: 1 }] as T[]).then(
        onfulfilled,
        onrejected
      );
    }
  }

  const sql = <T>(strings: TemplateStringsArray, ...values: Interpolable[]) =>
    new CustomStatement<T>(strings, values);

  const rows = await sql<{ a: number }>`select * from table`;

  enforceType<{ a: number }[]>(rows);

  assert.deepStrictEqual(rows, [{ a: 1 }]);
});

it("allows extending the sql interface", () => {
  const sql = Object.assign(
    (strings: TemplateStringsArray, ...values: Interpolable[]) =>
      new Statement(strings, values),
    {
      ref(value: string) {
        return new Statement([`"${value.replace(/"/g, '""')}"`], []);
      },
      literal(value: any) {
        return new Statement(["", ""], [value]);
      },
      csv(values: Interpolable[]) {
        return new Statement(
          [
            "",
            ...values.map((_, i, { length }) => (i + 1 === length ? "" : ",")),
          ],
          values
        );
      },
    }
  );

  const statement = sql`select ${sql.ref("abc")} and ${sql.literal({
    a: 1,
  })} and col in (${sql.csv([1, 2, 3])})`;

  assert.strictEqual(
    statement.compile(),
    'select "abc" and $1 and col in ($2,$3,$4)'
  );
  assert.deepStrictEqual(statement.values, [{ a: 1 }, 1, 2, 3]);
});
