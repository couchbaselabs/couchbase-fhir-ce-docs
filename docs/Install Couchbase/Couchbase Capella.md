---
sidebar_position: 3
title: "Couchbase Capella"
---

# Couchbase Capella Setup

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info What is Capella?
**Couchbase Capella** is the fully-managed Database-as-a-Service (DBaaS) offering from Couchbase. It provides enterprise-grade Couchbase clusters in the cloud without the operational overhead.
:::

Capella offers two deployment options for FHIR CE. Choose based on your needs:

<Tabs>
<TabItem value="single" label="🚀 Single Node (Recommended)" default>

## Single Node Capella Setup

Perfect for development, testing, and small production workloads.

### Step 1: Create New Capella Cluster

<img src="/img/install/cb-capella-single-1.png" alt="Create Single Node Capella Cluster" />

:::tip Cluster Naming
You can name the cluster anything meaningful (e.g., "fhir-dev-cluster", "hospital-cluster")
:::

### Step 2: Configure Services

<img src="/img/install/cb-capella-single-2.png" alt="Configure Single Node Services" />

**Service Configuration:**

1. **Adjust Compute** - Select appropriate instance size for your workload
2. **Add Search Service** - Required for FHIR full-text search capabilities

:::success Required Services
Your cluster should now have **4 essential services**:

- ✅ **Data** - Document storage
- ✅ **Query** - N1QL query processing
- ✅ **Index** - Primary indexes
- ✅ **Search** - Full-text search (FTS)
  :::

</TabItem>
<TabItem value="custom" label="⚙️ Custom Configuration">

## Custom Capella Setup

For advanced users who need specific configurations.

### Step 1: Choose Custom Deployment

<img src="/img/install/cb-capella-custom-1.png" alt="Create Custom Capella Cluster" />

:::info Custom Setup

- Choose **Custom** deployment option
- Name your cluster appropriately
- This gives you full control over node configuration
  :::

### Step 2: Configure Single Node

<img src="/img/install/cb-capella-custom-2.png" alt="Configure Custom Services" />

**Custom Configuration Steps:**

1. **Delete extra nodes** - Keep only 1 node for single-node setup
2. **Adjust Compute** - Select instance type based on workload
3. **Add Search Service** - Essential for FHIR functionality

:::warning Single Node Setup
Make sure to **delete all nodes except 1** to create a true single-node deployment suitable for FHIR CE.
:::

</TabItem>
</Tabs>

## Network Security Configuration

### Add Allowed IP Addresses

<img src="/img/install/cb-capella-ip.png" alt="Configure Allowed IP Addresses" />

Configure network access for your FHIR server:

:::info Network Access Control
This setting controls **client access** to your Capella cluster. You have two options:
:::

<Tabs>
<TabItem value="specific" label="🔒 Specific IP (Recommended)" default>

**Add FHIR Server IP:**

- Add the specific IP address of your FHIR server
- More secure approach for production environments
- Requires knowing the exact IP where FHIR CE will run

</TabItem>
<TabItem value="anywhere" label="🌐 Allow From Anywhere">

**Allow access from anywhere:**

- Use `0.0.0.0/0` for development/testing
- **Not recommended for production** due to security implications
- Convenient for dynamic IP environments

</TabItem>
</Tabs>

## Database Access Configuration

### Create Cluster Access Credentials

<img src="/img/install/cb-capella-access.png" alt="Configure Database Access Credentials" />

Create database credentials for FHIR CE to access your Capella cluster:

:::warning Important - Save These Credentials
**Note down the username and password** - you will need these in your **FHIR CE `config.yaml`** file!
:::

**Access Configuration:**

- **Username**: Create a meaningful username (e.g., "fhir-service")
- **Password**: Generate a strong password
- **Bucket Access**: Choose **All Buckets**
- **Scope Access**: Choose **All Scopes**
- **Collection Access**: Choose **All Collections**
- **Permissions**: Grant **Read/Write** access

:::tip FHIR Requirements
FHIR CE requires **full read/write access** to all buckets, scopes, and collections to properly manage FHIR resources and multi-tenancy.
:::

## FHIR Tenant Configuration

### Create Your First Bucket

<img src="/img/install/cb-capella-bucket.png" alt="Create FHIR Tenant Bucket" />

Configure your first FHIR tenant bucket:

:::tip FHIR Multi-Tenancy
**FHIR CE is multi-tenant** - Each bucket represents a separate tenant with isolated data. You need at least **one bucket** to get started.
:::

**Bucket Configuration Guidelines:**

- **Bucket Name**: Choose a meaningful name (e.g., "tenant-1", "hospital-a", "fhir-dev")
- **Memory Quota**: Allocate based on your expected data volume
- **Bucket Type**: Keep as **Couchbase** (default)
- **Replicas**: Capella handles replication automatically
- **Compression**: Enabled by default for better storage efficiency

<Tabs>
<TabItem value="development" label="🧪 Development Setup" default>

**Recommended Configuration:**

```yaml
Bucket Name: fhir-dev
Memory Quota: 1 GB
Durability: Majority
Compression: Enabled
```

Perfect for development, testing, and proof-of-concept deployments.

</TabItem>
<TabItem value="production" label="🏥 Production Setup">

**Recommended Configuration:**

```yaml
Bucket Name: tenant-production
Memory Quota: 4 GB or higher
Durability: Majority Persist Active
Compression: Enabled
```

Suitable for production healthcare environments with high availability requirements.

</TabItem>
<TabItem value="multi-tenant" label="🏢 Multi-Tenant Setup">

**Multiple Buckets for Different Tenants:**

```yaml
Bucket 1: hospital-a (2 GB)
Bucket 2: clinic-network (1 GB)
Bucket 3: research-org (3 GB)
```

Each tenant gets completely isolated data storage and processing.

</TabItem>
</Tabs>

## Connection Information

After completing the setup, you'll need these details for your FHIR CE configuration:

:::info Required for FHIR CE config.yaml

- 📋 **Connection String**: Available in Capella Connect tab
- 👤 **Username**: Database access username you created
- 🔑 **Password**: Database access password you created
- 🪣 **Bucket Name(s)**: Names of the buckets you created
  :::

:::success Next Steps
🎉 **Congratulations!** Your Capella cluster is ready. Now you can install and configure FHIR CE to connect to this managed Couchbase instance.
:::
