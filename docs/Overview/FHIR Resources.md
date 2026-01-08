---
title: "FHIR Resources on Couchbase"
sidebar_position: 3
---

# FHIR Resources on Couchbase

FHIR defines **146+ resource types** in the R4 specification — each representing a different healthcare concept such as `Patient`, `Observation`, `Encounter`, or `Condition`.

Couchbase FHIR CE organizes these resources into **dedicated collections** within the **fhir bucket**, leveraging Couchbase’s **bucket / scope / collection** model for scalability, clarity, and high performance.

---

## Multi-Collection Strategy

Within the **fhir** bucket, Couchbase FHIR CE uses a **Resources scope** containing multiple collections:

```
{fhir}
└── Resources
├── Patient
├── Observation
├── Encounter
├── Condition
├── Procedure
├── MedicationRequest
├── DiagnosticReport
├── DocumentReference
├── Immunization
├── ServiceRequest
├── General
├── Versions
└── Tombstones
```

## Rationale

Not all FHIR resources are equal — some are **high-traffic** (frequently queried, updated, or referenced), while others are **low-traffic** or supporting.

To balance **query performance** and **index size**, we use a **hybrid strategy**:

| Category        | Resource Types                                                                                                                                                  | Storage                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **High-volume** | `Patient`, `Observation`, `Encounter`, `Condition`, `Procedure`, `MedicationRequest`, `DiagnosticReport`, `DocumentReference`, `Immunization`, `ServiceRequest` | Each has a **dedicated collection**                   |
| **Low-volume**  | All other FHIR resource types                                                                                                                                   | Stored in a shared **General** collection             |
| **System**      | Version history, soft deletes                                                                                                                                   | Stored in **Versions** and **Tombstones** collections |

This approach ensures:

- 🔹 **Smaller indexes** per collection
- 🔹 **Faster queries** for common resource types
- 🔹 **Simplified scaling** (move heavy collections to separate nodes)
- 🔹 **Clear separation** between active, historical, and deleted data

---

## Resource Lifecycle

### Active Resources

- Stored as native JSON in their respective collection (e.g. `Resources.Patient`)
- Include `meta` block with `versionId`, `lastUpdated`, and audit tags

### Historical Versions

- When a resource is updated, the **previous version** is copied into the `Resources.Versions` collection
- Enables FHIR `_history` and `vread` endpoints
- Preserves full JSON and metadata for auditability

### Soft Deletes

- FHIR mandates **soft deletion** — deleted resources must still be retrievable via `_history`
- Deleted items are moved to the `Resources.Tombstones` collection
- Retain metadata (ID, version, timestamp) for compliance and traceability

> No hard deletes — data integrity is preserved across all operations.

---

## Example: Patient Record

```json
{
  "resourceType": "Patient",
  "id": "12345",
  "meta": {
    "versionId": "3",
    "lastUpdated": "2025-10-06T12:00:00Z",
    "tag": [
      {
        "system": "http://couchbase.com/fhir/meta",
        "code": "active",
        "display": "Active Record"
      }
    ]
  },
  "name": [{ "family": "Smith", "given": ["John"] }],
  "gender": "male",
  "birthDate": "1980-02-14"
}
```

### Feature / Benefit

| Feature              | Benefit                                        |
| -------------------- | ---------------------------------------------- |
| Logical organization | Each resource type is easy to locate and query |
| Performance          | Smaller FTS indexes → faster searches          |
| Scalability          | Distribute heavy collections across nodes      |
| Maintainability      | Lifecycle policies per collection              |
| Compliance           | Full support for `_history` and soft deletes   |
| Flexibility          | Add/adjust collections as usage evolves        |

## Under the Hood

- Each collection has a dedicated **FTS index** tuned to its resource type (for example, `ftsPatient`, `ftsObservation`).
- The **General** collection uses a generic index with a `resourceType` filter to support diverse, low‑volume resources.
- Search requests automatically **route to the correct collection and index** based on `resourceType` and search parameters.
- **Audit metadata** (FHIR `meta` + implementation tags) is embedded in every document for traceability and governance.
- Updates write current resources to their collection and archive prior versions to **Versions**; deletions create **Tombstones** for `_history`.

## Summary

Couchbase FHIR CE’s collection‑based resource model:

- Mirrors real‑world usage patterns and access frequency
- Optimizes search performance via focused, smaller FTS indexes
- Simplifies lifecycle management with Versions and Tombstones
- Maintains full compliance with FHIR versioning and soft deletes

By aligning FHIR’s JSON resource model with Couchbase’s bucket/scope/collection architecture, the platform achieves **clarity, performance, and compliance** in a unified design.
