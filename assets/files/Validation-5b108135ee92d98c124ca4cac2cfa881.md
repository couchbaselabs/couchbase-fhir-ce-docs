---
title: "Validation and Profile"
sidebar_position: 2
---

# Validation and Profiles

When converting a Couchbase bucket into a FHIR-compliant store, validation ensures that all resources conform to the FHIR specification and optional implementation guides such as US Core.
Couchbase FHIR CE allows you to control the depth and strictness of validation based on your environment and data quality.

### Validation Mode

Defines how incoming FHIR resources are validated. Modes align with `config.yaml`:

#### Lenient

- Runs FHIR validation and logs warnings instead of rejecting errors.
- Accepts resources even if some fields fail validation.
- Good for development, integration testing, or mixed-quality sources.

#### None (Disabled)

- Skips validation for maximum performance.
- Recommended only for trusted pipelines or when validation is handled externally.
- Useful for bulk imports or synthetic data loading.

:::tip
Validation adds CPU overhead — use `lenient` or `none` for bulk operations depending on data quality.
:::

### Validation Profiles

Controls which FHIR Implementation Guide (IG) is used to validate resource structure and values.

#### None

- Performs base FHIR R4 validation only.
- Checks standard FHIR structural rules:
  - Field types
  - Required elements
  - Enumerations and primitive constraints
  - Does not enforce US Core or regional extensions.
  - Suitable for generic FHIR projects or non-US implementations.

#### US Core 6.1.0

- Enforces the HL7® US Core Implementation Guide 6.1.0, including:
- Mandatory profiles for key resources (Patient, Observation, Condition, etc.)
- Required extensions and bindings
- ValueSet constraints (e.g., specific coding systems, LOINC, SNOMED)
- Validates both structure and terminology bindings (e.g., codes must belong to specific value sets).
- Ensures compatibility with US Core tests such as HL7 Inferno.
- Uses HAPI FHIR validator and NPM IG packages under the hood.

### Example Scenarios

| Environment                  | Validation Mode | Profile       | Reason                                                  |
| ---------------------------- | --------------- | ------------- | ------------------------------------------------------- |
| Development                  | Lenient         | None          | Flexibility to test payloads and iteratively fix issues |
| Bulk Import / Synthetic Data | None            | None          | Max speed, external validation assumed                  |
| US projects (profiles on)    | Lenient         | US Core 6.1.0 | See warnings, keep data flowing                         |

## Modes at a Glance

| Mode        | Behavior                                                                 | Typical Use                                          |
| ----------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| **none**    | No validation performed; accepts any JSON containing `resourceType`.     | Rapid development, bulk import, trusted data sources |
| **lenient** | Validates against FHIR R4; logs warnings instead of rejecting on errors. | Integration with legacy systems, relaxed QA          |

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

#### ⚠ Passes lenient / fails none only if external checks are present

```
{ "resourceType": "Patient",
  "name": [{ "family": "Smith" }],
  "gender": "male"
}
```

- Reason: With US Core profile enabled, identifier and full name are expected.
  - none → ✅ accepts
  - lenient → ⚠ warns, still stores

#### ❌ Fails lenient

```
{ "resourceType": "Patient",
  "gender": "attack-helicopter",
  "birthDate": "1990-01-01" }
```

- Invalid enum (gender must be male | female | other | unknown).

#### ❌ Fails lenient

```
{ "resourceType": "Patient",
  "gender": "Male",
  "birthDate": "01/01/1990" }
```

- Wrong case + date format (YYYY-MM-DD expected).

#### ❌ Fails lenient

```
{ "resourceType": "Patient",
  "name": "Smith",
  "gender": "male" }
```

- name must be an array; invalid cardinality.

## Notes

- For base FHIR R4 (no profiles), both modes accept compatible resources; `lenient` still warns on minor issues.
- When profiles or terminology validation are active, `lenient` logs warnings for violations while `none` bypasses validation entirely.

## When Profiles Are Enabled

With a profile such as US Core 6.1.0, validation extends beyond base FHIR and checks required fields and terminology bindings. Example requirements for Patient include an identifier and a full name.

| Mode    | Result                         |
| ------- | ------------------------------ |
| none    | ✅ Accepted                    |
| lenient | ⚠ Logs warnings, stores anyway |

## Recommended Modes

| Use Case                        | Recommended Mode                                |
| ------------------------------- | ----------------------------------------------- |
| Development / testing           | **none** — fastest, skip validation             |
| Integration / external sources  | **lenient** — allow warnings, keep data flowing |
| Internal tools / synthetic data | **lenient** — balance speed and safety          |

## Understanding “Helpful” Parsing

Couchbase FHIR intentionally makes parsing forgiving to simplify developer experience:

- Converts single values to arrays automatically.
- Trims whitespace.
- Normalizes data types where unambiguous.

This means lenient and strict share the same parser — strict mode focuses on semantic validation, not raw JSON schema enforcement.

## Summary

| Mode    | Checks                  | Rejects                  | Best For       |
| ------- | ----------------------- | ------------------------ | -------------- |
| none    | None                    | Nothing                  | Bulk load, dev |
| lenient | FHIR rules (+ warnings) | Severe structural errors | Integration    |

### Bottom line:

- Without profiles, both modes accept compatible resources; `lenient` provides warnings.
- With profiles, `lenient` warns on violations; `none` skips validation.
- Use `none` only for development or trusted bulk imports.
