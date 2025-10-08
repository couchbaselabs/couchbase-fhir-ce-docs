---
sidebar_position: 1
title: "Prerequisite Install Docker"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip Quick Start
Couchbase FHIR CE can be installed with a single command on any system with Docker. The installer automatically downloads pre-built container images and starts all required services.
:::

## Prerequisites

:::info System Requirements

- **Memory**: 2GB RAM minimum (4GB recommended)
- **Storage**: 500MB for Docker images
- **Network**: Internet access for image downloads
- **Platform**: Linux (x64/ARM64), macOS (Intel/Apple Silicon)
  :::

### Docker and Docker Compose

You need Docker and Docker Compose installed on your system:

<Tabs>
<TabItem value="linux" label="Linux (RHEL/CentOS/Amazon Linux)" default>

```bash title="Install Docker on Linux"
# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker $USER

# Install Docker Compose
sudo yum install -y docker-compose-plugin
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu/Debian">

```bash title="Install Docker on Ubuntu/Debian"
# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker $USER
```

</TabItem>
<TabItem value="macos" label="macOS">

```bash title="Install Docker on macOS"
# Install Docker Desktop from https://docker.com/products/docker-desktop
# Docker Compose is included with Docker Desktop
```

:::note
After installation, log out and back in (or run `newgrp docker`) for group changes to take effect.
:::

</TabItem>
</Tabs>
