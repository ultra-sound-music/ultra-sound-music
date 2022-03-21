import { IFormFieldValue } from './useFormField';

export type IConstraintName = 'required' | 'pattern' | 'min' | 'max' | 'maxLength' | 'minLength';
export type IConstraint = string | number | boolean;

export interface IConstraintConfig {
  validate: (v?: IFormFieldValue, c?: IConstraint) => boolean;
  message: (n: string) => string;
}

export type IConstraintConfigs = {
  [name in IConstraintName]: IConstraintConfig;
};

export type IValidationConstraints = {
  [constraintName in IConstraintName]?: IConstraint;
};

export const constraintConfigs: IConstraintConfigs = {
  required: {
    validate: (val) => typeof val !== 'undefined' && val !== '',
    message: (fieldName) => `${fieldName} is required`
  },
  pattern: {
    validate: (val, pattern) =>
      typeof val === 'string' && typeof pattern === 'string' && new RegExp(pattern).test(val),
    message: (fieldName) => `${fieldName} is invalid`
  },
  minLength: {
    validate: (val, minLength) =>
      typeof val === 'string' && typeof minLength === 'number' && val.length >= minLength,
    message: (fieldName) => `${fieldName} is too short`
  },
  maxLength: {
    validate: (val, maxLength) =>
      typeof val === 'string' && typeof maxLength === 'number' && val.length <= maxLength,
    message: (fieldName) => `${fieldName} is too long`
  },
  min: {
    validate: (val, min) => typeof val === 'number' && typeof min === 'number' && val >= min,
    message: (fieldName: string) => `${fieldName} is too small`
  },
  max: {
    validate: (val, max) => typeof val === 'number' && typeof max === 'number' && val <= max,
    message: (fieldName: string) => `${fieldName} is too large`
  }
};

export const constraintNames = Object.keys(constraintConfigs);

export function validate(
  fieldName: string,
  value: IFormFieldValue,
  constraints: IValidationConstraints
): string[] {
  return Object.entries(constraints)
    .map(([constraintName, constraint]) => {
      const constraintConfig = constraintConfigs[constraintName as IConstraintName];
      const isValid = constraintConfig.validate(value, constraint);
      return isValid ? '' : constraintConfig.message(fieldName);
    })
    .filter((error) => error);
}
