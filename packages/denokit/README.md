# @kingsword09/denokit

### Deno

#### Example

```ts
import { which } from "jsr:@kingsword09/denokit";

// Sync
const denoExecPath = which.sync("deno");

// Async
const denoExecPath = await which.async("deno");
```
