---
title: "FHIR Bucket Config"
sidebar_position: 2
---

# Validation & Profiles

Couchbase FHIR CE validates all incoming and outgoing resources using the HAPI FHIR validator.
Validation behavior depends on two factors:

- Validation Mode — how strictly the resource is checked.
- Validation Profile — which FHIR/US Core specification the resource is checked against.

## FHIR Validation Modes

| Mode        | Behavior                                                                                 | Typical Use                                          | Example that Passes                              | Example that Fails                      |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------ | --------------------------------------- |
| **none**    | No validation performed. Accepts any JSON containing `resourceType`.                     | Rapid development, bulk import, trusted data sources | `{ "resourceType": "Patient", "gender": "xyz" }` | _Never fails_                           |
| **lenient** | Validates against the FHIR R4 spec but logs warnings instead of rejecting errors.        | Integration with legacy systems, relaxed QA          | Valid resource with minor omissions              | Missing required field → ⚠ Warning only |
| **strict**  | Fully enforces FHIR R4 and profile constraints. Rejects invalid or incomplete resources. | Production, regulated environments                   | Valid, well-formed resource                      | Missing identifier → ❌ Rejects         |

## FHIR Normalization (applies to all modes)

Couchbase FHIR always normalizes input before validation:
| Input | Normalized Output | Note |
| --------------------- | ------------------- | ---------------- |
| `"given": "John"` | `"given": ["John"]` | Single → array |
| `"active": [true]` | `"active": true` | Array → scalar |
| `"family": " Smith "` | `"family": "Smith"` | Trims whitespace |

:::warning
Because normalization happens first, even strict mode won’t flag these shorthand formats as errors. Validation occurs after parsing.
:::

## Validation Examples

#### ✅ Valid in all modes

```
{ "resourceType": "Patient",
  "name": [{ "use": "official", "family": "Smith", "given": ["John"] }],
  "gender": "male",
  "birthDate": "1990-01-01"
}
```

#### ⚠ Passes lenient / none, fails strict

```
{ "resourceType": "Patient",
  "name": [{ "family": "Smith" }],
  "gender": "male"
}
```

- Reason: US Core requires an identifier and a full name.
  - none → ✅ accepts
  - lenient → ⚠ warns, still stores
  - strict → ❌ rejects

#### ❌ Fails lenient and strict

```
{ "resourceType": "Patient",
  "gender": "attack-helicopter",
  "birthDate": "1990-01-01" }
```

- Invalid enum (gender must be male | female | other | unknown).

#### ❌ Fails lenient and strict

```
{ "resourceType": "Patient",
  "gender": "Male",
  "birthDate": "01/01/1990" }
```

- Wrong case + date format (YYYY-MM-DD expected).

#### ❌ Fails lenient and strict

```
{ "resourceType": "Patient",
  "name": "Smith",
  "gender": "male" }
```

- name must be an array; invalid cardinality.

## lenient vs strict — the Real Difference

- For base FHIR R4 (no profiles) the spec is permissive, so lenient ≈ strict.
- Both reject obvious schema errors (invalid enum, wrong data type, bad cardinality).
- They differ only when profiles or terminology validation are active.
  | Scenario | lenient | strict |
  | ------------------------------------ | --------- | ----------------- |
  | Missing required field (per profile) | ⚠ Warns | ❌ Rejects |
  | Invalid value set binding | ⚠ Warns | ❌ Rejects |
  | Profile constraint violation | ⚠ Warns | ❌ Rejects |
  | Unknown extension | ✅ Accepts | ⚠ Warns / rejects |
  | Base FHIR structural error | ❌ Rejects | ❌ Rejects |

## When Profiles Are Enabled

When you set the profile for a bucket (e.g., US Core 6.1.0), validation extends beyond base FHIR:

US Core Patient requires:

- ≥ 1 identifier
- ≥ 1 name
- gender
- Example:
  `{ "resourceType": "Patient", "gender": "male" }`
  | Mode | Result |
  | ------- | ----------------------------------- |
  | none | ✅ Accepted |
  | lenient | ⚠ Logs warnings, stores anyway |
  | strict | ❌ Rejects (missing required fields) |

## Recommended Modes

| Use Case                                      | Recommended Mode                                |
| --------------------------------------------- | ----------------------------------------------- |
| Development / testing                         | **none** — fastest, skip validation             |
| Integration / external sources                | **lenient** — allow warnings, keep data flowing |
| Production / quality enforcement              | **strict** — reject invalid resources           |
| Regulated environments (HIPAA, GDPR, US Core) | **strict + profile** — required for compliance  |
| Internal tools / synthetic data               | **lenient** — balance speed and safety          |

## Understanding “Helpful” Parsing

Couchbase FHIR intentionally makes parsing forgiving to simplify developer experience:

- Converts single values to arrays automatically.
- Trims whitespace.
- Normalizes data types where unambiguous.

This means lenient and strict share the same parser — strict mode focuses on semantic validation, not raw JSON schema enforcement.

## Summary

| Mode    | Checks                          | Rejects                  | Best For                |
| ------- | ------------------------------- | ------------------------ | ----------------------- |
| none    | None                            | Nothing                  | Bulk load, dev          |
| lenient | FHIR rules (+ warnings)         | Severe structural errors | Integration             |
| strict  | FHIR + profiles (+ terminology) | Any violation            | Production / Compliance |

### Bottom line:

- Without profiles, lenient ≈ strict.
- With profiles, strict enforces structure, bindings, and required fields.
- Use none only for development or trusted bulk imports.
