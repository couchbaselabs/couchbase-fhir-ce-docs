---
sidebar_position: 4
title: "Couchbase Server on EC2"
---

# Couchbase Server on EC2

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info Self-Hosted Alternative
Running **Couchbase Server on EC2** gives you full control over your database infrastructure while leveraging AWS's reliable cloud platform. This is ideal for organizations that prefer self-managed deployments over Capella's managed service.
:::

## EC2 Instance Requirements

### Instance Sizing

:::tip Instance Recommendations
- **Minimum**: `t3.small` or `t3.medium` (avoid micro instances)
- **Recommended**: `t3.large` or `m5.large` for better performance
- **Production**: `m5.xlarge` or larger based on workload requirements
:::

**Why not micro instances?**
- Insufficient memory for Couchbase services
- Poor I/O performance for database operations
- May cause stability issues under load

### Operating System Support

Couchbase Server supports multiple Linux distributions on EC2:

<Tabs>
<TabItem value="amazon-linux" label="🟠 Amazon Linux" default>

**Amazon Linux 2 (Recommended for EC2)**
- Optimized for AWS infrastructure
- Built-in AWS integrations
- Regular security updates from AWS

```bash title="Instance Type"
Amazon Linux 2 AMI (HVM), SSD Volume Type
Instance: t3.large or larger
Storage: 20GB+ GP3 SSD
```

</TabItem>
<TabItem value="ubuntu" label="🟧 Ubuntu">

**Ubuntu Server 20.04 LTS or 22.04 LTS**
- Long-term support versions
- Wide community support
- Familiar for many administrators

```bash title="Instance Type"
Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
Instance: t3.large or larger  
Storage: 20GB+ GP3 SSD
```

</TabItem>
<TabItem value="rhel" label="🔴 RHEL/CentOS">

**Red Hat Enterprise Linux or CentOS**
- Enterprise-grade stability
- Corporate support available
- Common in enterprise environments

```bash title="Instance Type"
RHEL 8.x or CentOS 8 (HVM), SSD Volume Type
Instance: t3.large or larger
Storage: 20GB+ GP3 SSD
```

</TabItem>
</Tabs>

## Security Group Configuration

### Required Ports for Couchbase

Configure your EC2 security group to allow the following ports:

:::warning Critical Security Configuration
Properly configuring security groups is **essential** for both functionality and security. Missing ports will prevent FHIR CE from connecting to Couchbase.
:::

**Inbound Rules:**

| Port Range | Protocol | Source | Purpose |
|------------|----------|---------|---------|
| `8091-8096` | TCP | Custom IP or 0.0.0.0/0 | Couchbase Web Console & APIs |
| `11210-11211` | TCP | FHIR Server IP | Couchbase Client Connections |
| `18091-18096` | TCP | Custom IP or 0.0.0.0/0 | Couchbase SSL Ports (if using SSL) |
| `80` | TCP | 0.0.0.0/0 | HTTP (for FHIR server communication) |
| `443` | TCP | 0.0.0.0/0 | HTTPS (optional, for secure access) |
| `22` | TCP | Your IP | SSH Access |

<Tabs>
<TabItem value="development" label="🧪 Development Setup" default>

**For Development/Testing:**
```bash
Source: 0.0.0.0/0 (Allow from anywhere)
```
- Convenient for development and testing
- **Not recommended for production**
- Easy to set up and troubleshoot

</TabItem>
<TabItem value="production" label="🏥 Production Setup">

**For Production:**
```bash
Source: FHIR Server IP/32 (Specific IP only)
Source: Your Admin IP/32 (For web console access)
```
- More secure approach
- Requires knowing exact IP addresses
- Recommended for production environments

</TabItem>
</Tabs>

## Installation Process

### Step 1: Download Couchbase Server

Visit the official Couchbase downloads page:
**https://www.couchbase.com/downloads/?family=couchbase-server**

Choose the **Enterprise Edition** package that matches your EC2 instance's operating system.

### Step 2: Install Based on OS

<Tabs>
<TabItem value="amazon-linux" label="Amazon Linux Installation" default>

```bash title="Install on Amazon Linux 2"
# Download the RPM package (replace with latest version URL)
wget https://packages.couchbase.com/releases/7.2.4/couchbase-server-enterprise-7.2.4-amzn2.x86_64.rpm

# Install Couchbase Server
sudo rpm -ivh couchbase-server-enterprise-7.2.4-amzn2.x86_64.rpm

# Start Couchbase Service
sudo systemctl start couchbase-server
sudo systemctl enable couchbase-server
```

</TabItem>
<TabItem value="ubuntu" label="Ubuntu Installation">

```bash title="Install on Ubuntu"
# Download the DEB package (replace with latest version URL)
wget https://packages.couchbase.com/releases/7.2.4/couchbase-server-enterprise_7.2.4-ubuntu20.04_amd64.deb

# Install Couchbase Server
sudo dpkg -i couchbase-server-enterprise_7.2.4-ubuntu20.04_amd64.deb

# Fix any dependency issues
sudo apt-get update
sudo apt-get install -f

# Start Couchbase Service
sudo systemctl start couchbase-server
sudo systemctl enable couchbase-server
```

</TabItem>
<TabItem value="rhel" label="RHEL/CentOS Installation">

```bash title="Install on RHEL/CentOS"
# Download the RPM package (replace with latest version URL)
wget https://packages.couchbase.com/releases/7.2.4/couchbase-server-enterprise-7.2.4-rhel8.x86_64.rpm

# Install Couchbase Server
sudo rpm -ivh couchbase-server-enterprise-7.2.4-rhel8.x86_64.rpm

# Start Couchbase Service
sudo systemctl start couchbase-server
sudo systemctl enable couchbase-server
```

</TabItem>
</Tabs>

## Couchbase Configuration

### Access Web Console

After installation, access the Couchbase Web Console:

```
http://YOUR-EC2-PUBLIC-IP:8091
```

:::tip Getting Your EC2 Public IP
Find your instance's public IP in the AWS EC2 console or run:
```bash
curl http://checkip.amazonaws.com/
```
:::

### Setup Process

:::success Same as Docker Setup
**The Couchbase configuration process is identical to the Docker setup:**

1. ✅ **Setup New Cluster**
2. ✅ **Create Administrator Credentials** 
3. ✅ **Configure Services** (Data, Query, Index, Search)
4. ✅ **Set Memory Quotas** 
5. ✅ **Create FHIR Bucket(s)**

📖 **Follow the same steps** as described in the [Couchbase Docker guide](./Couchbase%20-%20Docker.md) for detailed configuration instructions.
:::

## EC2-Specific Considerations

### Performance Optimization

**Storage:**
- Use **GP3 SSD** for better IOPS performance
- Allocate sufficient storage for your data volume
- Consider separate volumes for data and logs

**Networking:**
- Use **Enhanced Networking** for better network performance
- Consider **Placement Groups** for multi-node deployments
- Monitor network utilization and adjust instance types as needed

### Monitoring & Maintenance

```bash title="Useful Commands"
# Check Couchbase service status
sudo systemctl status couchbase-server

# View Couchbase logs
sudo tail -f /opt/couchbase/var/lib/couchbase/logs/couchbase.log

# Check memory and disk usage
free -h
df -h
```

### Backup Considerations

:::warning Data Protection
- Set up regular **EC2 snapshots** for your instance
- Configure **Couchbase backup** using cbbackup or Backup Service
- Consider **cross-region backup** for disaster recovery
:::

## Network Access for FHIR CE

### Connection from FHIR Server

Your FHIR CE server will need to connect to this EC2 instance. Ensure:

1. **Security Group** allows traffic from FHIR server IP
2. **Network ACLs** don't block the connection  
3. **Route tables** are properly configured
4. **DNS resolution** works (use public IP or Route 53)

:::info Connection String for FHIR CE
When configuring FHIR CE, use your EC2 instance's connection details:
```yaml
connection:
  connectionString: "couchbase://YOUR-EC2-PUBLIC-IP"
  username: "Administrator"
  password: "your-password"
  serverType: "Server"
  sslEnabled: false
```
:::

:::success Next Steps
🎉 **Your EC2 Couchbase Server is ready!** You can now proceed to install and configure FHIR CE to connect to this self-hosted Couchbase instance.
:::
