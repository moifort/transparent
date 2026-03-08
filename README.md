# transparent

Remove image backgrounds via an API.

## What's in the box

- An **API server** that accepts an image and returns it with the background removed
- **Authentication** so only authorized clients can use the API (optional)
- A **Docker setup** for deploying the server at home or in the cloud

## Prerequisites

| Tool | What it does | Install |
|------|-------------|---------|
| [Bun](https://bun.sh/) | Runs the server and manages dependencies | `curl -fsSL https://bun.sh/install \| bash` |
| [uv](https://docs.astral.sh/uv/) | Runs the Python tool that removes backgrounds | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| [Docker](https://www.docker.com/) | Deploys the server (optional) | [docker.com](https://www.docker.com/) |

## Installation

1. Clone the repo:

```bash
git clone https://github.com/you/transparent.git
cd transparent
```

2. Install dependencies:

```bash
bun install
```

3. Create your configuration file:

```bash
cp .env.example .env
```

## Setting up keys

### API token (optional)

**What it does:** protects your server so only authorized clients can use it. When set, every request must include the token. When left empty, the server accepts all requests.

**How to create one:**

```bash
openssl rand -hex 32
```

**Where to put it:**

| File | Variable |
|------|----------|
| `.env` | `NITRO_API_TOKEN=your-token-here` |

### Max file size

**What it does:** limits how large an uploaded image can be. Defaults to 10 MB.

**Where to put it:**

| File | Variable |
|------|----------|
| `.env` | `NITRO_MAX_FILE_SIZE_MB=10` |

## Running the project

1. Start the server:

```bash
bun run dev
```

The server starts at `http://localhost:3000`.

2. Verify it works:

```bash
curl http://localhost:3000/health
```

You should see `{"status":"ok"}`.

## API usage

### Remove background

Send an image as multipart form data, get back a PNG with the background removed.

```bash
curl -X POST http://localhost:3000/remove-background \
  -F "image=@photo.jpg" \
  -o result.png
```

If you set an API token, include it in the request:

```bash
curl -X POST http://localhost:3000/remove-background \
  -H "Authorization: Bearer your-token-here" \
  -F "image=@photo.jpg" \
  -o result.png
```

**Supported formats:** PNG, JPEG, WebP

**Size limit:** configured by `NITRO_MAX_FILE_SIZE_MB` (default: 10 MB)

## Deployment

### Docker

1. Build the image:

```bash
bun run build
docker build -t transparent .
```

2. Start the server:

```bash
docker compose up -d
```

Set `NITRO_API_TOKEN` and `NITRO_MAX_FILE_SIZE_MB` in a `.env` file next to `docker-compose.yml`, or directly in the `docker-compose.yml` environment section.

## Documentation

| Guide | What it covers |
|-------|---------------|
| [API reference for LLMs](llms-full.txt) | How to call the API from another project — endpoints, auth, code examples |
