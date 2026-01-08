---
sidebar_position: 3
title: "Install FHIR Server"
---

# Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Installation

Run the one-line installer with your configuration file:

```bash title="Install Couchbase FHIR CE"
curl -sSL https://raw.githubusercontent.com/couchbaselabs/couchbase-fhir-ce/master/install.sh | bash -s -- ./config.yaml
```

:::info Installation Process
The installer will:

1. Download the required configuration files
2. Verify file integrity with checksums
3. Pull the latest Docker images
4. Start all services (FHIR server, web interface, load balancer)
5. Display the access URL
   :::

:::tip Install Output

```
ec2-user@ip-172-31-25-234 ~ $ curl -sSL https://raw.githubusercontent.com/couchbaselabs/couchbase-fhir-ce/master/install.sh | bash -s -- ./config.yaml
🚀 Couchbase FHIR CE Installer

✅ Using: docker-compose
✅ Using config file: ./config.yaml
📁 Installation directory: /home/ec2-user/couchbase-fhir-ce
📁 Creating logs directory...

📦 Pulling configuration generator...
latest: Pulling from couchbaselabs/couchbase-fhir-ce/fhir-generator
Digest: sha256:33ce2953c74b8c91298d708f71229484711f6bc949d99e5008b38872fb0e1e19
Status: Image is up to date for ghcr.io/couchbaselabs/couchbase-fhir-ce/fhir-generator:latest
ghcr.io/couchbaselabs/couchbase-fhir-ce/fhir-generator:latest

🔧 Generating docker-compose.yml and haproxy.cfg...
📝 Reading configuration: config.yaml
🌐 Base URL: http://ec2-35-94-15-196.us-west-2.compute.amazonaws.com/fhir
🚪 Ports: HTTP=80, HTTPS=443
🔒 TLS: Disabled
💾 JVM Memory: 12g - 12g

🐳 Generating docker-compose.yml...
✅ Generated: docker-compose.yml
🔀 Generating haproxy.cfg...
✅ Generated: haproxy.cfg

✅ Generation complete!

📌 Next steps:
   docker-compose up -d
✅ Configuration files generated

📥 Downloading management scripts...
✅ Scripts downloaded

📦 Pulling FHIR server images...
[+] Pulling 3/3
 ✔ fhir-server Pulled 0.4s
 ✔ fhir-admin Pulled  0.3s
 ✔ haproxy Pulled     0.7s

🚀 Starting services...
[+] Running 4/4
 ✔ Network couchbase-fhir-ce_default  Created 3s
 ✔ Container fhir-server              Started 8s
 ✔ Container fhir-admin               Started 8s
 ✔ Container haproxy                  Started 3s
⏳ Waiting for services to start...

✅ Couchbase FHIR CE is now running!

🌐 Access URL: http://ec2-35-94-15-196.us-west-2.compute.amazonaws.com

📋 Useful Commands:
   cd couchbase-fhir-ce
   View logs:    docker compose logs -f
   Stop:         docker compose down
   Restart:      docker compose restart
   Status:       docker compose ps
   Update:       Edit config.yaml, then: ./scripts/apply-config.sh config.yaml

📚 Documentation:
   https://fhir.couchbase.com/docs/intro
```

:::

## What Gets Installed

:::tip Installation Contents
The installer creates a `couchbase-fhir-ce` directory containing:
:::

**3 Docker containers:**

- **`fhir-server`** - FHIR API backend (Spring Boot)
- **`fhir-admin`** - Web-based administration interface
- **`haproxy`** - Load balancer and reverse proxy

**Configuration files:**

- **`docker-compose.yml`** - Container orchestration
- **`haproxy.cfg`** - Load balancer configuration
- **`config.yaml`** - Your Couchbase connection settings
- **`scripts/apply-config.sh`**

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

```bash title="Example of fhir-server log"
ec2-user@ip-172-31-25-234 ~/couchbase-fhir-ce $ docker compose logs -f fhir-server
fhir-server  | Picked up JAVA_TOOL_OPTIONS: -Xms12g -Xmx12g -XX:+UseG1GC -XX:MaxGCPauseMillis=200
fhir-server  | 19:01:14,936 |-WARN in ch.qos.logback.core.model.processor.AppenderModelHandler - Appender named [FILE] not referenced. Skipping further processing.
fhir-server  | 19:01:14,937 |-WARN in ch.qos.logback.core.model.processor.AppenderModelHandler - Appender named [SDK_FILE] not referenced. Skipping further processing.
fhir-server  |
fhir-server  |   .   ____          _            __ _ _
fhir-server  |  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
fhir-server  | ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
fhir-server  |  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
fhir-server  |   '  |____| .__|_| |_|_| |_\__, | / / / /
fhir-server  |  =========|_|==============|___/=/_/_/_/
fhir-server  |
fhir-server  |  :: Spring Boot ::                (v3.5.0)
fhir-server  |
fhir-server  | 2025-12-24T19:01:26.337Z ERROR No active connection found for: default (available: [])
fhir-server  | 2025-12-24T19:01:26.344Z INFO  🪵 Logging level override: com.couchbase.admin.config.service.ConfigurationStartupService -> INFO
fhir-server  | 2025-12-24T19:01:26.345Z INFO  🔧 Couchbase SDK configuration: Using SDK defaults (no overrides in config.yaml)
fhir-server  | 2025-12-24T19:01:26.345Z INFO  📋 FHIR Server base URL: http://ec2-35-94-15-196.us-west-2.compute.amazonaws.com/fhir
fhir-server  | 2025-12-24T19:01:26.345Z INFO  🔐 Admin UI credentials loaded from config.yaml
fhir-server  | 2025-12-24T19:01:26.345Z INFO  ℹ️  CORS configuration is managed in application.yml (default: allow all origins)
fhir-server  | 2025-12-24T19:01:26.345Z INFO  🔗 Attempting auto-connection to: ec2-54-69-205-199.us-west-2.compute.amazonaws.com (Server)
fhir-server  | 2025-12-24T19:01:27.318Z INFO  ✅ Auto-connection successful!
fhir-server  | 2025-12-24T19:01:27.318Z INFO  🔐 Initializing OAuth signing key...
fhir-server  | 2025-12-24T19:01:27.385Z INFO  🔐 Loading active JWT tokens into cache...
fhir-server  | 2025-12-24T19:01:27.392Z INFO  ✅ Token cache initialized with 1 active tokens
fhir-server  | 2025-12-24T19:01:27.405Z INFO  ╔══════════════════════════════════════════════════════════════╗
fhir-server  | 2025-12-24T19:01:27.406Z INFO  ║         FHIR SYSTEM INITIALIZATION STATUS                    ║
fhir-server  | 2025-12-24T19:01:27.406Z INFO  ╚══════════════════════════════════════════════════════════════╝
fhir-server  | 2025-12-24T19:01:27.406Z INFO  📊 Status: READY
fhir-server  | 2025-12-24T19:01:27.406Z INFO  📦 Bucket: fhir
fhir-server  | 2025-12-24T19:01:27.406Z INFO  🔗 Connection: ✅ Connected
fhir-server  | 2025-12-24T19:01:27.406Z INFO  🪣 Bucket Exists: ✅ Yes
fhir-server  | 2025-12-24T19:01:27.406Z INFO  ⚙️  FHIR Initialized: ✅ Yes
fhir-server  | 2025-12-24T19:01:27.406Z INFO  ─────────────────────────────────────────────────────────────
fhir-server  | 2025-12-24T19:01:27.406Z INFO  ✅ FHIR system is fully initialized and ready.
fhir-server  | 2025-12-24T19:01:27.406Z INFO  🚀 Backend startup complete - FHIR APIs are now available
fhir-server  | 2025-12-24T19:01:27.406Z INFO  💡 Collections will be warmed up automatically on first access
fhir-server  | 2025-12-24T19:01:27.406Z INFO  ╚══════════════════════════════════════════════════════════════╝
fhir-server  | 2025-12-24T19:01:27.407Z WARN  ╔════════════════════════════════════════════════════════════╗
fhir-server  | 2025-12-24T19:01:27.407Z WARN  ║           TOMCAT THREAD POOL CONFIGURATION                 ║
fhir-server  | 2025-12-24T19:01:27.407Z WARN  ╚════════════════════════════════════════════════════════════╝
fhir-server  | 2025-12-24T19:01:27.407Z WARN  🚀 Virtual Threads:         ENABLED (Java 21+)
fhir-server  | 2025-12-24T19:01:27.407Z WARN     ✅ Thread pool limits no longer apply
fhir-server  | 2025-12-24T19:01:27.407Z WARN     ✅ Can handle 1000+ concurrent connections efficiently
fhir-server  | 2025-12-24T19:01:27.407Z WARN  ────────────────────────────────────────────────────────────
fhir-server  | 2025-12-24T19:01:27.407Z WARN  📊 Max Threads:             200
fhir-server  | 2025-12-24T19:01:27.407Z WARN  📊 Min Spare Threads:       10
fhir-server  | 2025-12-24T19:01:27.407Z WARN  📊 Accept Count (Queue):    100
fhir-server  | 2025-12-24T19:01:27.407Z WARN  📊 Max Connections:         10000
fhir-server  | 2025-12-24T19:01:27.407Z WARN  📊 Connection Timeout:      20000
fhir-server  | 2025-12-24T19:01:27.407Z WARN  📊 Max Keep-Alive Requests: 100
fhir-server  | 2025-12-24T19:01:27.407Z WARN  ════════════════════════════════════════════════════════════
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

## Configuration Management

:::warning Do Not Edit Generated Files
The `docker-compose.yml` and `haproxy.cfg` files are auto-generated by the installer. Do not edit them manually. Any changes will be overwritten the next time configuration is applied.
:::

To change settings, edit `config.yaml` in the `couchbase-fhir-ce` folder and run the apply script:

```bash title="Apply configuration changes"
cd couchbase-fhir-ce
# Edit your configuration
nano config.yaml
# Re-generate docker-compose.yml and haproxy.cfg
./scripts/apply-config.sh ./config.yaml
# Optionally restart services to apply changes
docker compose restart
```

Common configuration changes:

- Change logging levels
- Change JVM memory settings
- Change FHIR baseUrl
- Change Couchbase connection settings
- Add TLS/HTTPS support (see: Enable TLS/HTTPS)

## Ports and Networking

:::info Port Configuration
The installation exposes only **port 80** externally through HAProxy, which routes traffic to the appropriate services:

- **`/`** - Web administration interface
- **`/fhir/*`** and **`/api/*`** - FHIR API endpoints
  :::

**Internal container ports** (not exposed):

- **`fhir-server`**: 8080
- **`fhir-admin`**: 80
- **`haproxy`**: 80 (mapped to host port 80)

## Security Considerations

:::tip Security Features

- The installer verifies file integrity using SHA256 checksums
- Only downloads configuration files and official container images
- No executable code is downloaded from external sources
- All containers run with non-root users where possible
  :::

## Supported Platforms

The installer supports:

- **AWS EC2** (automatic hostname detection)
- **Google Cloud Platform** (automatic IP detection)
- **Microsoft Azure** (automatic IP detection)
- **Local development** (localhost)
- **Any Linux/macOS system** with Docker

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

- Verify your `config.yaml` connection details
- Check network connectivity to your Couchbase server
- Ensure the Couchbase user has appropriate permissions
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
