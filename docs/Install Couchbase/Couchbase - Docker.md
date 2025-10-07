---
sidebar_position: 2
title: "Couchbase Docker"
---

# Couchbase Docker Setup

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prerequisites

:::info Requirements

- **Docker** should be installed and running
- **Port 8091** should be available for Couchbase Web Console
  :::

For detailed Docker installation instructions, please refer to: https://docs.couchbase.com/server/current/install/getting-started-docker.html

## Install Couchbase

Run the Couchbase Server container:

```bash title="Start Couchbase Server"
docker run -d --name couchbase-server -p 8091-8096:8091-8096 -p 11210-11211:11210-11211 couchbase:enterprise-7.2.4
```

## Configure Couchbase

Access the Couchbase Web Console at: **http://localhost:8091**

## Setup Cluster

<img src="/img/install/cb-docker-1.png" width="400" alt="Setup Cluster" />

Click **Setup New Cluster** to begin the configuration process.

## Create your access credentials

<img src="/img/install/cb-docker-2.png" width="400" alt="Create Access Credentials" />

:::tip Cluster Configuration

- **Cluster Name**: You can name the cluster as per your choice (e.g., "FHIR-Cluster")
- **Username**: Administrator username for cluster access
- **Password**: Choose a strong password - **Note this down as you will be using it later when configuring FHIR**
  :::

## Configure Disk, Memory, Services

<img src="/img/install/cb-docker-3.png" width="400" alt="Configure Disk, Memory, Services" />

:::warning Important
**Do not** finish with defaults! Instead, choose the **Configure** option to properly configure the services for FHIR usage.
:::

## Set Services Quotas

<img src="/img/install/cb-docker-4.png" width="400" alt="Set Services Quotas" />

Configure the services specifically for FHIR usage:

:::info FHIR Service Configuration
**Node Settings:**

- **Node IP**: Leave as `127.0.0.1` (default)

**Required Services for FHIR:**

- ✅ **Data Service** - Core document storage
- ✅ **Query Service** - N1QL queries for FHIR operations
- ✅ **Index Service** - Primary indexes
- ✅ **Search Service** - Full-text search capabilities

**Memory Allocation:**

- **Query Service**: Set to `0` (unlimited)
- **Data & Search**: Allocate same size (e.g., 1024 MB each)
- **Index Service**: Minimal allocation (e.g., 256 MB) - FHIR does not use GSI indexes heavily
  :::

:::tip Service Selection
FHIR CE primarily uses **Data**, **Query**, **Index**, and **Search** services. Other services like Analytics and Eventing are not required for basic FHIR functionality.
:::

## Create Bucket

<img src="/img/install/cb-docker-5.png" width="400" alt="Create Bucket" />

Configure your first FHIR tenant bucket:

:::tip FHIR Multi-Tenancy
**FHIR CE is multi-tenant** - Each bucket represents a separate tenant with isolated data. You need at least **one bucket** to get started.
:::

**Bucket Configuration:**

- **Bucket Name**: Choose a meaningful name (e.g., "tenant-1", "hospital-a")
- **Memory Quota**: Choose size based on your workload requirements
- **Bucket Type**: Keep as **Couchbase** (default)
- **Replicas**: **Uncheck "Enable Replicas"** - This is a single node setup
- **Compression**: Enable for better storage efficiency

<Tabs>
<TabItem value="development" label="Development Setup" default>

```
Bucket Name: fhir-dev
Memory Quota: 512 MB
Replicas: Disabled
Compression: Enabled
```

</TabItem>
<TabItem value="production" label="Production Setup">

```
Bucket Name: tenant-production
Memory Quota: 2048 MB or higher
Replicas: Disabled (single node)
Compression: Enabled
```

</TabItem>
</Tabs>

:::success Next Steps
After creating your bucket, you're ready to install and configure the FHIR CE server to connect to this Couchbase instance!
:::
