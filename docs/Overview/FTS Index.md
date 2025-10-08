---
title: "Indexing Strategy"
sidebar_position: 4
---

# Indexing Strategy

Efficient search is the heart of any FHIR server.

Couchbase FHIR CE uses **Full Text Search (FTS)** as the **primary search engine**—backed by **Key-Value (KV)** lookups for lightning-fast retrieval.

This hybrid design enables:

- **Sub-100 ms** search latency, even across millions of documents
- Full support for **FHIR search parameters** (string, token, date, reference, number)
- A **single source of truth** — indexes reference the same JSON you store

---

## FTS-First Search

Each collection (e.g. `Patient`, `Observation`, `General`) has a dedicated **FTS index** tuned for its resource type.

FTS supports complex queries:

- **Text**: match, prefix, fuzzy, phrase
- **Token**: system|code, coding arrays
- **Date**: range, prefix, equality
- **Number**: comparison and ranges
- **Reference**: `subject.reference`, `patient.reference`, etc.
- **Multi-field** conjunctive/disjunctive logic

> Example:  
> Find active Observations for `Patient/123` with `code=loinc|1234-5` between two dates.  
> All handled in a **single FTS query**.

---

## KV + FTS Hybrid Flow

1. **FTS** executes the search → returns matching **document keys**.
2. **KV** API fetches the full JSON docs by key in microseconds.
3. Response is assembled into a **FHIR Bundle**.

This separation lets FTS handle **query semantics**, while KV ensures **fast, consistent reads**.

### KV-Only Pagination

Subsequent pages can reuse the cached keyset → **no repeated FTS cost**.

---

## Example FTS Query

```json
{
  "query": {
    "conjuncts": [
      { "field": "resourceType", "match": "Patient" },
      { "field": "name.given", "prefix": "john" },
      { "field": "birthDate", "start": "1980-01-01", "end": "1990-12-31" }
    ]
  },
  "size": 20,
  "from": 0,
  "sort": []
}

Index: `tenant.Resources.ftsPatient`

Result: list of matching document IDs → KV fetch → FHIR Bundle
```

### FTS Capabilities Used

| Parameter Type | Common FHIR Fields                       | FTS Feature          |
| -------------- | ---------------------------------------- | -------------------- |
| string         | `name`, `family`, `given`, `address`     | prefix, analyzers    |
| token          | `identifier`, `code` (system\|code)      | exact token, keyword |
| date           | `effectiveDateTime`, `birthDate`         | range                |
| reference      | `subject.reference`, `patient.reference` | exact path match     |
| number         | `valueQuantity.value`                    | numeric range        |

## Under the Hood

- **Per‑collection indexes**: `ftsPatient`, `ftsObservation`, `ftsGeneral` tuned to resource shapes.
- **Document type filter**: index only documents with `resourceType` present and valid.
- **Field mappings**: explicit mappings for all FHIR search parameters; dynamic mappings for nested arrays.
- **Analyzers**: keyword for tokens/codes, standard/lowercase for names and addresses; date/time parsing for temporal fields.
- **Partitions**: large collections use **partitioned FTS indexes** for linear scalability and higher parallelism.

### Why FTS over GSI / SQL

| Feature             | RDBMS / GSI          | Couchbase FTS                   |
| ------------------- | -------------------- | ------------------------------- |
| JSON handling       | Flattened columns    | Native JSON paths               |
| Multi‑valued arrays | Complex joins        | Built‑in array indexing         |
| Full‑text           | Limited / none       | Rich analyzers, stemming, fuzzy |
| Search parameters   | Manual mapping       | Direct field mapping            |
| Performance         | Heavy joins          | O(1) KV fetch + parallel FTS    |
| Consistency         | Dual representations | Single JSON source              |

Traditional RDBMS FHIR servers store JSON in a column and project search terms into relational indexes — creating duplication and synchronization overhead. Couchbase FHIR CE indexes **directly on JSON** → no flattening, no loss of fidelity.

## Summary

Couchbase FHIR CE’s FTS‑first strategy delivers:

- FHIR‑compliant search semantics
- High throughput and low latency via KV + FTS
- Single‑source‑of‑truth indexing on canonical JSON
- Scalable performance with partitioned indexes
- Rich query semantics beyond SQL/relational models

FTS handles discovery; KV handles retrieval — together enabling fast, accurate, and scalable FHIR search.
