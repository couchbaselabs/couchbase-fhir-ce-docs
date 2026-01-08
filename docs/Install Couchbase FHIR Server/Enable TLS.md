---
sidebar_position: 4
title: "Enable TLS/HTTPS"
---

# Enable TLS/HTTPS

This guide shows how to enable HTTPS for Couchbase FHIR CE, using a real domain and certificates. It also clarifies that TLS for the FHIR web/API traffic is different from TLS used by the Couchbase SDK when connecting to Couchbase (e.g., Capella).

## Before You Start

- You have a domain (e.g., `cbfhir.com`).
- Your DNS points to the host running Couchbase FHIR CE. If you use Cloudflare, DNS setup is outside the scope of this page.
- You can obtain valid server certificates (e.g., via Let's Encrypt).

## Where TLS Is Applied

- HTTPS for end users terminates at HAProxy (the load balancer in `couchbase-fhir-ce`).
- Couchbase SDK TLS (to Couchbase/Capella) is separate and configured via connection settings in `config.yaml`.

## Configure HTTPS (Example: Cloudflare + Let's Encrypt)

1. Obtain a certificate for your domain (e.g., `cbfhir.com`) via Let's Encrypt (or your CA).
2. Place the certificate and private key files on the host machine (e.g., under `couchbase-fhir-ce/certs/`).
3. Edit `couchbase-fhir-ce/config.yaml` and update the TLS section to reference your certificate files and enable HTTPS. Also update `baseUrl` to use `https://<your-domain>/fhir`.
4. Apply the configuration and restart services.

```bash title="Apply TLS configuration"
cd couchbase-fhir-ce
# Edit your config
nano config.yaml

Example:
----------------------------------------------------------------
app:
  baseUrl: "https://cbfhir.com/fhir"
  autoConnect: true

couchbase:
  connection:
    connectionString: "ec2-54-69-205-100.us-west-2.compute.amazonaws.com"
    username: "Administrator"
    password: "P@ssw0rd"
    serverType: "Server" # [Server, Capella]
    sslEnabled: false # [true, false]

  bucket:
    name: "fhir" # Fixed
    fhirRelease: "R4" # Fixed
    validation:
      mode: "lenient"     # [lenient, none]
      profile: "us-core"  # [us-core, none]

  sdk:
    overrides: {}

admin:
  email: "admin@cbfhir.com"
  password: "Admin123!"
  name: "Admin"

deploy:
  container:
    mem_limit: "20g"
    mem_reservation: "16g"

  jvm:
    xms: "12g"
    xmx: "12g"

  environment:
    overrides: {}

  tls:
    enabled: true
    # For HAProxy: single PEM containing fullchain + privkey
    pemPath: "./certs/cbfhir.com.pem"

logging:
  default: "ERROR"
  overrides:
  # overrides. Complete list of availabe overrides in docs
  com.couchbase.admin.config.service.ConfigurationStartupService: "INFO"
  com.couchbase.fhir.config.TomcatConfigLogger: "WARN"
  com.couchbase.fhir.config.VirtualThreadConfig: "WARN"
--------------------------------------------------------

# Re-generate docker-compose.yml and haproxy.cfg
./scripts/apply-config.sh ./config.yaml
# Restart to apply
docker compose restart
```

:::warning Do Not Edit Generated Files
Do not manually edit `docker-compose.yml` or `haproxy.cfg`. They are generated from `config.yaml` and will be overwritten when you re-apply configuration.
:::

## Certificate Path Mapping

When you set `deploy.tls.pemPath` to a host file (e.g., `./certs/cbfhir.com.pem`), the installer maps it into the HAProxy container with a standardized name:

- Host: `./certs/cbfhir.com.pem` (your actual certificate file)
- Container: `/etc/haproxy/certs/server.pem` (standardized name inside container)

This keeps your original filename on the host, and ensures HAProxy always references a consistent path: `/etc/haproxy/certs/server.pem`.

## Add TLS Later (No Redeploy)

You can enable TLS after an initial non-TLS install without redeploying:

```bash title="Enable TLS after install"
cd couchbase-fhir-ce

# Edit config.yaml in the installation folder
nano config.yaml

# Example changes
#
# deploy:
#   tls:
#     enabled: true
#     pemPath: "./certs/cbfhir.com.pem"
# app:
#   baseUrl: "https://cbfhir.com/fhir"

# Apply config and restart services
./scripts/apply-config.sh ./config.yaml
docker compose restart
```

What `apply-config.sh` does:

- Reads the local `config.yaml` in `couchbase-fhir-ce`
- Regenerates `docker-compose.yml` and `haproxy.cfg` (including TLS settings)
- Restarts services to apply the new configuration

## Update Your Base URL

When enabling HTTPS, ensure `baseUrl` reflects the public HTTPS endpoint, typically:

- `https://cbfhir.com/fhir`

This value is used by the server to construct absolute links and should match your public URL.

## Verify HTTPS

```bash title="Quick checks"
# Expect HTTP->HTTPS redirect or direct 200
curl -I https://cbfhir.com

# Check the FHIR base path
curl -I https://cbfhir.com/fhir/metadata

# Inspect certificate chain
openssl s_client -connect cbfhir.com:443 -servername cbfhir.com </dev/null | sed -n '1,20p'
```

## Couchbase TLS (Capella)

If you connect to Couchbase Capella, TLS is built-in on the database side. Configure SDK/connection TLS independently in `config.yaml` (this uses different certificates/settings than your HTTPS certificate). The HTTPS certificate for HAProxy does not affect SDK connections.

## Renewals

When certificates are renewed, update the files on the host, then re-run:

```bash
cd couchbase-fhir-ce
./scripts/apply-config.sh ./config.yaml
docker compose restart
```
