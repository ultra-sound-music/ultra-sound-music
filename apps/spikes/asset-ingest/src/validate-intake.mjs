// A stricter draft-07-ish JSON Schema checker than band-jam's jam.mjs
// hand-rolled `validate()`, which only checks required-key-presence and enum
// membership — it silently accepts a 1-element tempoRange, a negative bpm, or
// peak > 1. Ingested data becomes semi-permanent provenance, so this also
// enforces type, numeric bounds (minimum/maximum/exclusiveMinimum/
// exclusiveMaximum), and array length (minItems/maxItems). Deliberately scoped
// to asset-ingest only — does not touch or replace jam.mjs's validator.

function typeOf(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

export function validate(value, schema, path = '$') {
  const errs = [];

  if (schema.enum) {
    if (!schema.enum.includes(value)) {
      errs.push(`${path}=${JSON.stringify(value)} not in [${schema.enum.join(', ')}]`);
    }
    return errs;
  }

  const actual = typeOf(value);

  if (schema.type) {
    const expected = schema.type === 'integer' ? 'number' : schema.type;
    if (actual !== expected) {
      errs.push(`${path} expected type ${schema.type}, got ${actual} (${JSON.stringify(value)})`);
      return errs;
    }
    if (schema.type === 'integer' && !Number.isInteger(value)) {
      errs.push(`${path}=${value} is not an integer`);
    }
  }

  if (actual === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errs.push(`${path}=${value} < minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errs.push(`${path}=${value} > maximum ${schema.maximum}`);
    }
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      errs.push(`${path}=${value} <= exclusiveMinimum ${schema.exclusiveMinimum}`);
    }
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
      errs.push(`${path}=${value} >= exclusiveMaximum ${schema.exclusiveMaximum}`);
    }
  }

  if (actual === 'array') {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errs.push(`${path} has ${value.length} items, needs >= ${schema.minItems}`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errs.push(`${path} has ${value.length} items, needs <= ${schema.maxItems}`);
    }
    if (schema.items) {
      value.forEach((el, i) => errs.push(...validate(el, schema.items, `${path}[${i}]`)));
    }
  }

  if (actual === 'object') {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in value)) errs.push(`${path}.${key} is required`);
      }
    }
    if (schema.properties) {
      for (const [key, sub] of Object.entries(schema.properties)) {
        if (key in value) errs.push(...validate(value[key], sub, `${path}.${key}`));
      }
    }
  }

  return errs;
}

export function assertValid(value, schema, label) {
  const errs = validate(value, schema, label);
  if (errs.length) {
    console.error(`${label} failed validation:`);
    errs.forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
}
