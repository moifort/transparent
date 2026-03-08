# Transparent

HTTP API to remove image backgrounds. Send an image (PNG, JPEG, or WebP), get back a PNG with the background removed.

## Installation

### Docker

1. Download the compose file and start the server:

```bash
curl -O https://raw.githubusercontent.com/moifort/transparent/main/docker-compose.yml
docker compose up -d
```

The server starts at `http://localhost:3000`.

2. Verify it works:

```bash
curl http://localhost:3000/health
```

### CasaOS

Use the [CasaOS compose file](docker-compose-casaos.yml) to install Transparent from the CasaOS app store.

## Configuration

Create a `.env` file next to `docker-compose.yml`:

```env
NITRO_API_TOKEN=your-token-here
NITRO_MAX_FILE_SIZE_MB=10
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NITRO_API_TOKEN` | Protects access to the API. When set, every request must include the token. When empty, the server accepts all requests. | _(none)_ |
| `NITRO_MAX_FILE_SIZE_MB` | Maximum upload size in megabytes. | `10` |

To generate a token:

```bash
openssl rand -hex 32
```

## API usage

### Remove background

```bash
curl -X POST http://localhost:3000/remove-background \
  -F "image=@photo.jpg" \
  -o result.png
```

With API token:

```bash
curl -X POST http://localhost:3000/remove-background \
  -H "Authorization: Bearer your-token-here" \
  -F "image=@photo.jpg" \
  -o result.png
```

**Supported formats:** PNG, JPEG, WebP

## LLM documentation

Machine-readable API documentation is available at [llms-full.txt](llms-full.txt).
