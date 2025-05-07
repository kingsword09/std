# @kingsword/toolkit

[![JSR](https://jsr.io/badges/@kingsword/toolkit)](https://jsr.io/@kingsword/toolkit)

### Deno

#### Example

```ts
import { transformRecordEntries } from "jsr:@kingsword/toolkit";
const obj = { a: 1, b: 2, c: 3 };
const transformedObj = transformRecordEntries(obj, (key, value) => value * 2);
```

---

### Node

#### Installation

```bash
# pnpm >= 10.9.0
# https://pnpm.io/cli/add#install-from-the-jsr-registry
pnpm add jsr:@kingsword/toolkit
```

##### package.json

```json
{
  "dependencies": {
    "@kingsword/toolkit": "jsr:x.y.z"
  }
}
```

#### Example

```ts
import { transformRecordEntries } from "@kingsword/toolkit";
const obj = { a: 1, b: 2, c: 3 };
const transformedObj = transformRecordEntries(obj, (key, value) => value * 2);
```
