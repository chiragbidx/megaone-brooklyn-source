FROM node:20-alpine

WORKDIR /app

# minimal deps for git-based hot reload
RUN apk add --no-cache git

COPY . /app

EXPOSE 8080

CMD ["node", "scripts/static-supervisor.js"]
