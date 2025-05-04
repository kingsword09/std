# @kingsword/nodekit

[![JSR](https://jsr.io/badges/@kingsword/nodekit)](https://jsr.io/@kingsword/nodekit)

### Deno

#### Example

```ts
import { which } from "jsr:@kingsword/nodekit";

// Sync
const denoExecPath = which.sync("deno");

// Async
const denoExecPath = await which.async("deno");
```

---

### Node

#### Installation

```bash
# pnpm >= 10.9.0
# https://pnpm.io/cli/add#install-from-the-jsr-registry
pnpm add jsr:@kingsword/nodekit
```

##### package.json

```json
{
  "dependencies": {
    "@kingsword/nodekit": "jsr:x.y.z"
  }
}
```

#### Example

```ts
import { which } from "@kingsword/nodekit";

// Sync
const denoExecPath = which.sync("deno");

// Async
const denoExecPath = await which.async("deno");
```
