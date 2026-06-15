# spec-forge
Schema-validated **config → spec** builder. Applies typed defaults, validates types/enums/min-max, and optionally transforms the result into a final spec object. Zero dependencies. Original code, released under MIT.
## Install
```
npm install spec-forge
```
## Use
```js
const { build } = require("spec-forge");
const schema = {
  name:  { type: "string", required: true },
  speed: { type: "number", default: 8, min: 1, max: 16 },
  mode:  { type: "string", default: "balanced", enum: ["subtle","balanced","dramatic"] },
};
build({ name: "job1" }, schema);                       // { name, speed: 8, mode: "balanced" }
build({ name: "job1" }, schema, (v) => ({ job: v }));  // transform into final spec
```
## License
Original code, released under the [MIT License](./LICENSE). © 2026 WCN Development Co.
