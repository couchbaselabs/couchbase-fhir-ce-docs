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
# ============================================================================
# Couchbase FHIR CE - Configuration File
# ============================================================================
# Edit this file, then run: ./scripts/apply-config.sh
# ============================================================================

app:
  # Public URL for your FHIR server
  # Examples:
  #   Dev:   http://localhost:8080/fhir
  #   Prod:  https://acme.com/fhir
  baseUrl: "http://localhost:8080/fhir"
  autoConnect: true

couchbase:
  connection:
    connectionString: "localhost"
    # connectionString: "ec2-xx-xx-xxx-xxx.us-west-2.compute.amazonaws.com"
    # connectionString: "couchbases://cb.xxx-xxx.cloud.couchbase.com"
    # connectionString: "host.docker.internal"
    username: "Administrator"
    password: "password"
    serverType: "Server" # [Server, Capella]
    sslEnabled: false # [true, false]

  bucket:
    name: "fhir" # Fixed
    fhirRelease: "R4" # Fixed
    validation:
      mode: "lenient" # [lenient, none]
      profile: "us-core" # [us-core, none]

  # search:
  #   logs: # Coming soon
  #     enableSystem: false # Enable System Logs
  #     enableCRUDAudit: false # Enable CRUD Audit Logs
  #     enableSearchAudit: false # Enable Search Audit Logs
  #     rotationBy: "size" # size, days
  #     number: 30 # in GB or Days
  #     s3Endpoint: "" # Example: https://s3.amazonaws.com" # S3 Endpoint for Log Upload

  sdk:
    overrides:
    # overrides. Complete list of available overrides in docs. Example below.
    # Do not change unless you know what you are doing
    # transaction-durability: MAJORITY # [NONE, MAJORITY, MAJORITY_AND_PERSIST_TO_ACTIVE, PERSIST_TO_MAJORITY]
    # max-http-connections: 12 # Max HTTP Connections
    # num-kv-connections: 1 # Max KV Connections
    # kv-timeout-seconds: 30 # KV Timeout
    # query-timeout-seconds: 30 # Query Timeout
    # search-timeout-seconds: 30 # Search Timeout
    # connect-timeout-seconds: 10 # Connect Timeout
    # disconnect-timeout-seconds: 10 # Disconnect Timeout
    # transaction-timeout-seconds: 30 # Transaction Timeout

admin:
  email: "admin@example.com"
  password: "Admin123!"
  name: "Admin"

deploy:
  container:
    mem_limit: "2g"
    mem_reservation: "1g"

  jvm:
    xms: "1g"
    xmx: "2g"

  environment:
    overrides:
    # overrides. Complete list of available overrides in docs. Example below.
    # Do not change unless you know what you are doing
    # SERVER_TOMCAT_THREADS_MAX: 200 # Max threads
    # SERVER_TOMCAT_THREADS_MIN_SPARE: 10 # Minimum idle threads
    # SERVER_TOMCAT_ACCEPT_COUNT: 100 # Queue size when all threads busy
    # SERVER_TOMCAT_MAX_CONNECTIONS: 10000 # Max simultaneous connections
    # SERVER_TOMCAT_CONNECTION_TIMEOUT: 20s # Connection timeout
    # SERVER_TOMCAT_MAX_KEEP_ALIVE_REQUESTS: 1000 # Keep-alive requests per connection

  tls:
    enabled: false
    # When enabled, HAProxy needs combined cert+key in single PEM:
    # pemPath: "./certs/<your-domain>.pem"
    #
    # To create combined PEM: cat cert.pem privkey.pem > cbfhir.com.pem

logging:
  default: "ERROR"
  overrides:
    # --- Application loggers. ERROR by default --- [ERROR, WARN, INFO, DEBUG]
    # com.couchbase.admin: ERROR
    # com.couchbase.fhir: ERROR
    # com.couchbase.common: ERROR
    # The following 3 are useful
    com.couchbase.admin.config.service.ConfigurationStartupService: "INFO"
    com.couchbase.fhir.config.TomcatConfigLogger: "WARN"
    com.couchbase.fhir.config.VirtualThreadConfig: "WARN"

    # --- Couchbase SDK loggers. ERROR by default --- [ERROR, WARN, INFO, DEBUG]
    # com.couchbase.core: ERROR # KV operations, timeouts, retries
    # com.couchbase.client: ERROR # Collection maps, queries
    # com.couchbase.transactions: ERROR # Transaction timing, conflicts
    # com.couchbase.io: ERROR # Network I/O (very verbose at INFO)
    # com.couchbase.endpoint: ERROR # Endpoint management
    # com.couchbase.node: ERROR # Node health
    # com.couchbase.tracing: ERROR # Threshold events (disable WARN messages)
# Optional (enabled via separate script)
# keycloak:
#   enabled: false
#   realm: "fhir-realm"
#   adminUser: "admin"
#   adminPassword: "admin"
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
