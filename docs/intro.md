---
sidebar_position: 1
title: "Introduction"
---

# Welcome to Couchbase FHIR CE

Deliver secure, scalable healthcare data interoperability with **Couchbase FHIR CE** – a modern, open-source FHIR server built on Couchbase. Whether you're a healthcare startup, an enterprise team, or an individual developer, this project is your entry point into managing **FHIR R4 / US Core–compliant data** with Couchbase Server and Capella.

## Why Choose Couchbase FHIR CE?

:::tip[Standards-Compliant]
Fully supports **FHIR R4** resources with a focus on **US Core profiles**.<br />
Validated against **HL7 Inferno tests** for compliance and “Must Support” search parameters.
:::

:::tip[Flexible Storage Model]
Leverages Couchbase **buckets, scopes, and collections** for resource storage.<br />
Supports both **Named resource collections** (e.g., Patient, Observation) and a **General collection** for other types.
:::

:::tip[FTS-Powered Search]
Built on **Couchbase Full Text Search (FTS)** indexes.<br />
Provides rich support for FHIR search parameters, including **string, token, reference, and date** queries.<br />
Handles advanced queries like **\_include**, **\_revinclude**, and **$everything**.
:::

:::tip[Developer-Friendly]
Dockerized deployment for quick setup on **local machines**, **EC2 instances**, or **Capella clusters**.<br />
REST API powered by **Spring Boot + HAPI FHIR**, with a ready-to-use **Postman collection**.<br />
Audit metadata stored in every resource (`fhir-meta`).
:::

:::tip[Observability Built-In]
Metrics available via **Micrometer + Actuator endpoints**, plus Couchbase REST stats.<br />
Optional **React-based dashboard** for visualizing queries, indexes, and performance metrics.
:::

_And much more to come…_

## Your Influence, Our Direction

- **Community Edition**: Couchbase FHIR CE is **community-driven** and open source. It is not an officially supported Couchbase product, but represents the cutting edge of FHIR + Couchbase innovation.<br />
- **Feedback-Driven Roadmap**: Development is shaped by user feedback. Features like **synthetic data loaders, advanced dashboards, and US Core coverage** are all community-prioritized.<br />
- **Rapid Iteration**: Expect frequent updates. While we aim for production-readiness, this CE edition evolves quickly and may include experimental features.<br />
- **Cross-Platform Deployment**: Works with **Couchbase Server (on-prem)** and **Capella (cloud)**.<br />
- **Built on Proven Tech**: Harnesses Couchbase’s distributed NoSQL platform plus **Spring Boot, HAPI FHIR, React, and Docker**.

## Join Us in This Exciting Journey

Couchbase FHIR CE is more than just software — it’s a **community of healthcare innovators** building interoperable systems on a modern NoSQL foundation.

Be part of this journey, share your feedback, and help us make FHIR on Couchbase powerful, compliant, and developer-friendly.

_Embrace the future of healthcare data with Couchbase FHIR CE – where innovation meets interoperability._
