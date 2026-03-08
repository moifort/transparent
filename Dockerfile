# syntax=docker/dockerfile:1.7

FROM oven/bun:1.2.21-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.2.21-debian AS runtime
WORKDIR /app

# Install Python, uv, and pre-install rembg dependencies
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip curl && \
    rm -rf /var/lib/apt/lists/* && \
    curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:$PATH"

# Pre-install rembg + dependencies and download the u2net model
RUN uv run --with rembg --with onnxruntime --with pillow python3 -c "from rembg import new_session; new_session('u2net')"

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_SERVER_URL=http://127.0.0.1:3000

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
