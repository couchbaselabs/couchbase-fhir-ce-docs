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
curl -sSL https://raw.githubusercontent.com/couchbaselabs/couchbase-fhir-ce/master/install.sh | bash -s -- ./config.yaml

🚀 Installing/Upgrading Couchbase FHIR CE...
🔧 Using: docker-compose
📁 Working in directory: /Users/krishna.doddi/couchbase-fhir-ce
📥 Downloading installation files...
🔐 Verifying file integrity...
✅ File integrity verified
📋 Using config file: ./config.yaml
🛑 Stopping existing containers...
📦 Pulling latest images...

[+] Pulling 28/28
✔ fhir-server Pulled ....
✔ fhir-admin Pulled ....
✔ haproxy Pulled ....

🚀 Starting Couchbase FHIR CE...

[+] Running 4/4
✔ Network couchbase-fhir-ce_default Created
✔ Container couchbase-fhir-ce-fhir-server-1 Started
✔ Container couchbase-fhir-ce-fhir-admin-1 Started
✔ Container couchbase-fhir-ce-haproxy-1 Started

✅ Couchbase FHIR CE is now running!
🌐 Access the FHIR server at: http://localhost
Note: If running on a remote server, use your server's external hostname or IP address

📋 Useful commands:
cd couchbase-fhir-ce
View logs: docker-compose logs -f
Stop: docker-compose down
Restart: docker-compose restart
Status: docker-compose ps
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
