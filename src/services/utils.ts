import {ConstraintViolation} from "./types";

export function findConstraintViolation(property: string, violations: ConstraintViolation[]) : ConstraintViolation | null{
  for (let i = 0; i < violations.length; i++) {
    if (violations[i].property === property) {
      return violations[i];
    }
  }
  return null;
}

export function hasViolation(property: string, violations: ConstraintViolation[]) : boolean {
  return findConstraintViolation(property, violations) !== null;
}