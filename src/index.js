// spec-forge — schema-validated "config -> spec" builder with typed defaults. Zero deps.
// Original code, released under MIT. Generic builder — bring your own schema.
function applyDefaults(input, schema) {
  const out = {};
  for (const [key, def] of Object.entries(schema)) {
    let val = input[key];
    if (val === undefined || val === null) val = def.default;
    if (def.required && (val === undefined || val === null)) throw new Error(`missing required field: ${key}`);
    if (val !== undefined && def.type && typeof val !== def.type && def.type !== "any")
      throw new Error(`field "${key}" expected ${def.type}, got ${typeof val}`);
    if (val !== undefined && def.enum && !def.enum.includes(val))
      throw new Error(`field "${key}" must be one of ${def.enum.join(", ")}`);
    if (val !== undefined && def.type === "number") {
      if (def.min !== undefined && val < def.min) throw new Error(`field "${key}" below min ${def.min}`);
      if (def.max !== undefined && val > def.max) throw new Error(`field "${key}" above max ${def.max}`);
    }
    out[key] = val;
  }
  return out;
}
// build: validate + default an input against a schema, optionally transform into a final spec.
function build(input, schema, transform) {
  const validated = applyDefaults(input || {}, schema);
  return transform ? transform(validated) : validated;
}
module.exports = { build, applyDefaults };
