const assert = require("assert");
const { build, applyDefaults } = require("../src/index.js");
const schema = {
  name: { type: "string", required: true },
  speed: { type: "number", default: 8, min: 1, max: 16 },
  mode: { type: "string", default: "balanced", enum: ["subtle", "balanced", "dramatic"] },
};
const out = build({ name: "job1" }, schema);
assert.strictEqual(out.speed, 8);
assert.strictEqual(out.mode, "balanced");
assert.throws(() => build({}, schema));                       // missing required
assert.throws(() => build({ name: "x", speed: 99 }, schema)); // over max
assert.throws(() => build({ name: "x", mode: "nope" }, schema)); // bad enum
const t = build({ name: "x" }, schema, (v) => ({ wrapped: v }));
assert.strictEqual(t.wrapped.name, "x");
console.log("spec-forge: all tests passed");
