FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_GULASADAR_BASEURL=http://localhost:4000
ENV NEXT_PUBLIC_GULASADAR_BASEURL=$NEXT_PUBLIC_GULASADAR_BASEURL
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
