# `sql2`

A TypeScript library for writing SQL queries using template strings with automatic parameterization and nested statement support.

## Features

- **Template String Syntax**: Write SQL using JavaScript template literals
- **Automatic Parameterization**: Values are automatically parameterized to prevent SQL injection
- **Nested Statements**: Embed SQL statements within other statements
- **Extensible**: Customize parameterization and add helper methods
- **Type Safe**: Full TypeScript support

## Installation

```bash
npm install sql2
```

## Usage

### Basic Usage

First, extend the `Statement` class to add a `query` method that executes the SQL:

```typescript
import { Statement, type Interpolable } from "sql2";

class QueryableStatement extends Statement {
  async query() {
    return client.query(this.compile(), this.values);
  }
}

const sql = (strings: TemplateStringsArray, ...values: Interpolable[]) =>
  new QueryableStatement(strings, values);

// Simple query without values
const result1 = await sql`select 1`.query();
console.log(result1.rows); // [{ "?column?": 1 }]

// Query with parameterized values
const result2 = await sql`select ${1} as value`.query();
console.log(result2.rows); // [{ value: 1 }]
```

### Nested Statements

You can embed SQL statements within other statements:

```typescript
const result =
  await sql`select exists (${sql`select * from table where id = ${"abc"}`}) and ${true}`.query();

console.log(result.rows);
// The nested statement is automatically flattened and parameterized
```

### Extending the SQL Interface

Add helper methods to your SQL function for common patterns:

```typescript
import { Statement, type Interpolable } from "sql2";

class ExtendedStatement extends Statement {
  async query() {
    return client.query(this.compile(), this.values);
  }
}

const sql = Object.assign(
  (strings: TemplateStringsArray, ...values: Interpolable[]) =>
    new ExtendedStatement(strings, values),
  {
    // Quote identifiers
    ref(value: string) {
      return new ExtendedStatement([`"${value.replace(/"/g, '""')}"`], []);
    },
    // Insert literal values (not parameterized)
    literal(value: any) {
      return new ExtendedStatement(["", ""], [value]);
    },
    // Create comma-separated values
    csv(values: Interpolable[]) {
      return new ExtendedStatement(
        [
          "",
          ...values.map((_, i, { length }) => (i + 1 === length ? "" : ",")),
        ],
        values
      );
    },
  }
);

const result =
  await sql`select ${sql.ref("abc")} and ${sql.literal({ a: 1 })} and col in (${sql.csv([1, 2, 3])})`.query();
// Executes: select "abc" and $1 and col in ($2,$3,$4)
```

## API

### `Statement`

The main class for building SQL statements.

#### Constructor

```typescript
new Statement(strings: ReadonlyArray<string>, values: Interpolable[])
```

#### Methods

- `compile()`: Returns the compiled SQL string with parameterized placeholders
- `parameterize(index: number)`: Override this method to customize parameter format (default: `$1`, `$2`, etc.)

#### Extending for Query Execution

To execute queries, extend `Statement` and add a `query()` method:

```typescript
import { Statement } from "sql2";

class QueryableStatement extends Statement {
  async query() {
    return client.query(this.compile(), this.values);
  }
}
```

#### Properties

- `strings`: Array of string parts and placeholders
- `values`: Array of interpolated values

### `Interpolable`

Type for values that can be interpolated into SQL statements:

```typescript
type Interpolable = Statement | number | string | boolean | null;
```

## License

CC0-1.0
