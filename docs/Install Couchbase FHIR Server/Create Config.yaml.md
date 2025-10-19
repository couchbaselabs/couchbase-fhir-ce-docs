---
sidebar_position: 2
title: "Create config.yaml"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Couchbase Server

:::warning Prerequisites
Couchbase FHIR CE requires a running Couchbase Server instance. You can use:

- **Couchbase Server** (self-hosted)
- **Couchbase Capella** (cloud service)
- **Local Couchbase instance** for development
  :::

## Configuration

Create a `config.yaml` file with your Couchbase connection and FHIR server settings:

```yaml title="config.yaml - Complete Template with example values"
connection:
  ## connectionString: "localhost"
  ## connectionString: "ec2-174-174-64-174.compute-1.amazonaws.com"
  ## connectionString: "couchbases://cb.abcdxyz.cloud.couchbase.com"
  connectionString: "host.docker.internal"
  username: "Administrator"
  password: "password123"
  serverType: "Server"
  sslEnabled: false

couchbase:
  sdk:
    transaction-durability: NONE
    max-http-connections: 128
    num-kv-connections: 8
    query-timeout-seconds: 30
    search-timeout-seconds: 30
    connect-timeout-seconds: 10
    disconnect-timeout-seconds: 10
    transaction-timeout-seconds: 30

app:
  autoConnect: true

logging:
  levels:
    com.couchbase.admin: ERROR
    com.couchbase.fhir: ERROR
    com.couchbase.common: ERROR
    com.couchbase.admin.config.service.ConfigurationStartupService: INFO
    # To silence a noisy lib:
    # org.springframework.web: ERROR
```

:::warning Yaml Indents
When copying and pasting the above config, after pasting, please make sure that the _indents_ are preserved. Yaml files need to be indented properly, otherwise, they will not load.
:::

### Configuration Sections Explained

<Tabs>
<TabItem value="connection" label="🔌 Connection Settings" default>

**Connection Configuration:**

- **`connectionString`**: Couchbase server endpoint
  - `localhost` - Local Couchbase installation
  - `host.docker.internal` - Docker Desktop for Mac/Windows
  - `ec2-xxx.compute-1.amazonaws.com` - AWS EC2 instance
  - `couchbases://cb.xxx.cloud.couchbase.com` - Capella (SSL)
- **`username/password`**: Database credentials
- **`serverType`**: "Server" or "Capella"
- **`sslEnabled`**: SSL/TLS connection (true for Capella)

</TabItem>
<TabItem value="couchbase" label="⚙️ Couchbase SDK Settings">

**SDK Performance Tuning:**

- **`transaction-durability`**: NONE (faster) vs MAJORITY (safer)
- **`max-http-connections`**: HTTP connection pool size (128)
- **`num-kv-connections`**: Key-value connection count (8)
- **`query-timeout-seconds`**: N1QL query timeout (30s)
- **`search-timeout-seconds`**: FTS search timeout (30s)
- **`connect-timeout-seconds`**: Initial connection timeout (10s)
- **`disconnect-timeout-seconds`**: Clean disconnect timeout (10s)
- **`transaction-timeout-seconds`**: Transaction timeout

:::tip Performance vs Durability

- **NONE durability**: Faster performance, less data safety
- **MAJORITY durability**: Slower but ensures data persistence
  :::

</TabItem>
<TabItem value="app" label="📱 Application Settings">

**Application Behavior:**

- **`autoConnect`**: Automatically connect to Couchbase on startup
  - `true` - Connect immediately (recommended)
  - `false` - Manual connection required

</TabItem>
<TabItem value="logging" label="📝 Logging Configuration">

**Log Level Control:**

- **`ERROR`**: Show only errors (recommended for production)
- **`INFO`**: Show informational messages
- **`DEBUG`**: Verbose logging (development only)

**Key Loggers:**

- **`com.couchbase.admin`**: Admin UI components
- **`com.couchbase.fhir`**: FHIR server operations
- **`com.couchbase.common`**: Shared utilities
- **`ConfigurationStartupService`**: Startup information

:::note Custom Logging
Uncomment and modify logging levels as needed. For example, enable Spring Web logging for request debugging.
:::

</TabItem>
</Tabs>

### Environment-Specific Examples

<Tabs>
<TabItem value="local" label="🖥️ Local Development" default>

```yaml title="Local Docker/Server Setup"
connection:
  connectionString: "host.docker.internal" # Docker Desktop
  # connectionString: "localhost"           # Local install
  username: "Administrator"
  password: "password123"
  serverType: "Server"
  sslEnabled: false
```

</TabItem>
<TabItem value="ec2" label="🌐 AWS EC2">

```yaml title="EC2 Couchbase Server"
connection:
  connectionString: "ec2-12-34-56-78.compute-1.amazonaws.com"
  username: "Administrator"
  password: "your-secure-password"
  serverType: "Server"
  sslEnabled: false
```

</TabItem>
<TabItem value="capella" label="☁️ Couchbase Capella">

```yaml title="Capella Cloud Service"
connection:
  connectionString: "couchbases://cb.abcd1234.cloud.couchbase.com"
  username: "database-user"
  password: "capella-password"
  serverType: "Capella"
  sslEnabled: true
```

</TabItem>
</Tabs>
