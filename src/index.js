/** WCN SpecForge — Schema-validated config-to-spec builder with typed defaults. */
class SpecForge {
  constructor(schema) {
    this.schema = schema;
    this.compiled = this._compile(schema);
  }

  _compile(schema) {
    const compiled = {};
    for (const [key, def] of Object.entries(schema)) {
      compiled[key] = {
        type: def.type || 'string',
        default: def.default,
        required: def.required || false,
        validate: def.validate || null,
        transform: def.transform || null,
        enum: def.enum || null,
      };
    }
    return compiled;
  }

  build(config = {}) {
    const spec = {};
    const errors = [];

    for (const [key, field] of Object.entries(this.compiled)) {
      let value = config[key];

      if (value === undefined || value === null) {
        if (field.required && field.default === undefined) {
          errors.push(`Missing required field: ${key}`);
          continue;
        }
        value = field.default;
      }

      if (value !== undefined && value !== null) {
        if (field.transform) value = field.transform(value);
        value = this._coerceType(value, field.type);
        if (field.enum && !field.enum.includes(value)) {
          errors.push(`Invalid value for ${key}: ${value}. Must be one of: ${field.enum.join(', ')}`);
        }
        if (field.validate && !field.validate(value)) {
          errors.push(`Validation failed for ${key}: ${value}`);
        }
      }

      spec[key] = value;
    }

    if (errors.length > 0) throw new Error('Spec validation errors: ' + errors.join('; '));
    return spec;
  }

  _coerceType(value, type) {
    switch (type) {
      case 'string': return String(value);
      case 'number': return Number(value);
      case 'boolean': return value === 'true' || value === true;
      case 'array': return Array.isArray(value) ? value : [value];
      case 'object': return typeof value === 'object' ? value : JSON.parse(value);
      default: return value;
    }
  }

  getDefaults() {
    const defaults = {};
    for (const [key, field] of Object.entries(this.compiled)) {
      defaults[key] = field.default;
    }
    return defaults;
  }

  validate(config) {
    try { this.build(config); return { valid: true, errors: [] }; }
    catch (e) { return { valid: false, errors: [e.message] }; }
  }
}

module.exports = { SpecForge };
