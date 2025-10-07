---
sidebar_position: 3
title: "Install FHIR Server"
---

# Installation

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

```yaml title="config.yaml - Complete Template"
connection:
  ## connectionString: "localhost"
  ## connectionString: "ec2-174-174-64-174.compute-1.amazonaws.com"
  ## connectionString: "couchbases://cb.abcdxyz.cloud.couchbase.com"
  connectionString: "host.docker.internal" # Works on Docker Desktop for Mac
  username: "Administrator"
  password: "P@ssw0rd"
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

## Installation

Run the one-line installer with your configuration file:

```bash title="Install Couchbase FHIR CE"
curl -sSL https://raw.githubusercontent.com/couchbaselabs/couchbase-fhir-ce/master/install.sh | bash -s -- ./config.yaml
```

:::info Installation Process
The installer will:

1. ✅ Download the required configuration files
2. ✅ Verify file integrity with checksums
3. ✅ Pull the latest Docker images
4. ✅ Start all services (FHIR server, web interface, load balancer)
5. ✅ Display the access URL
   :::

## What Gets Installed

:::tip Installation Contents
The installer creates a `couchbase-fhir-ce` directory containing:
:::

**3 Docker containers:**

- 🐳 **`fhir-server`** - FHIR API backend (Spring Boot)
- 🖥️ **`fhir-admin`** - Web-based administration interface
- ⚖️ **`haproxy`** - Load balancer and reverse proxy

**Configuration files:**

- 📋 **`docker-compose.yml`** - Container orchestration
- 🔧 **`haproxy.cfg`** - Load balancer configuration
- ⚙️ **`config.yaml`** - Your Couchbase connection settings

## Accessing the Server

After installation, the FHIR server will be available at:

<Tabs>
<TabItem value="aws" label="AWS EC2" default>

```
http://your-ec2-hostname.compute-1.amazonaws.com
```

</TabItem>
<TabItem value="local" label="Local/Other">

```
http://localhost
```

</TabItem>
</Tabs>

:::success Auto-Detection
The installer automatically detects your environment and displays the correct URL.
:::

## Managing the Installation

Navigate to the installation directory to manage services:

```bash title="Navigate to installation directory"
cd couchbase-fhir-ce
```

<Tabs>
<TabItem value="logs" label="View Logs" default>

```bash title="View all service logs"
docker-compose logs -f
```

```bash title="View specific service logs"
docker-compose logs -f fhir-server
docker-compose logs -f fhir-admin
```

</TabItem>
<TabItem value="control" label="Control Services">

```bash title="Stop services"
docker-compose down
```

```bash title="Start services"
docker-compose up -d
```

```bash title="Restart services"
docker-compose restart
```

```bash title="Check status"
docker-compose ps
```

</TabItem>
<TabItem value="update" label="Update">

```bash title="Update to latest version"
# Stop current installation
docker-compose down --rmi all
cd ..
rm -rf couchbase-fhir-ce

# Run installer again
curl -sSL https://raw.githubusercontent.com/couchbaselabs/couchbase-fhir-ce/master/install.sh | bash -s -- ./config.yaml
```

</TabItem>
</Tabs>

## Ports and Networking

:::info Port Configuration
The installation exposes only **port 80** externally through HAProxy, which routes traffic to the appropriate services:

- **`/`** - Web administration interface
- **`/fhir/*`** and **`/api/*`** - FHIR API endpoints
  :::

**Internal container ports** (not exposed):

- 🌐 **`fhir-server`**: 8080
- 🖥️ **`fhir-admin`**: 80
- ⚖️ **`haproxy`**: 80 (mapped to host port 80)

## Security Considerations

:::tip Security Features

- ✅ The installer verifies file integrity using SHA256 checksums
- ✅ Only downloads configuration files and official container images
- ✅ No executable code is downloaded from external sources
- ✅ All containers run with non-root users where possible
  :::

## Supported Platforms

The installer supports:

- 🌐 **AWS EC2** (automatic hostname detection)
- ☁️ **Google Cloud Platform** (automatic IP detection)
- 🔷 **Microsoft Azure** (automatic IP detection)
- 🖥️ **Local development** (localhost)
- 🐧 **Any Linux/macOS system** with Docker

## Troubleshooting

<Tabs>
<TabItem value="permissions" label="Permission Issues" default>

**Installation fails with permission denied:**

```bash title="Fix Docker permissions"
# Add user to docker group and restart session
sudo usermod -a -G docker $USER
# Log out and back in, then try again
```

</TabItem>
<TabItem value="connection" label="Connection Issues">

**Cannot connect to Couchbase:**

:::warning Connection Checklist

- ✅ Verify your `config.yaml` connection details
- ✅ Check network connectivity to your Couchbase server
- ✅ Ensure the Couchbase user has appropriate permissions
  :::

</TabItem>
<TabItem value="containers" label="Container Issues">

**Containers fail to start:**

```bash title="Check container logs"
cd couchbase-fhir-ce
docker-compose logs
```

</TabItem>
<TabItem value="ports" label="Port Conflicts">

**Port 80 already in use:**

```bash title="Check port usage"
# Check what's using port 80
sudo lsof -i :80
# Stop conflicting services or change port mapping in docker-compose.yml
```

</TabItem>
</Tabs>

## System Requirements

:::info Minimum Requirements

- **Memory**: 2GB RAM minimum (4GB recommended)
- **Storage**: 500MB for Docker images
- **Network**: Internet access for image downloads
- **Platform**: Linux (x64/ARM64), macOS (Intel/Apple Silicon)
  :::
