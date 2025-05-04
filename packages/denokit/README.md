# @kingsword/denokit

[![JSR](https://jsr.io/badges/@kingsword/denokit)](https://jsr.io/@kingsword/denokit)

### Deno

#### Example

```ts
import { which } from "jsr:@kingsword/denokit";

// Sync
const denoExecPath = which.sync("deno");

// Async
const denoExecPath = await which.async("deno");
```
