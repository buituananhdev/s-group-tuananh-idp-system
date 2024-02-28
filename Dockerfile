# Build Stage
FROM node:18-alpine AS build
ENV YARN_CACHE_FOLDER="/yarn_cache"
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN apk --no-cache add python3
RUN yarn install --frozen-lockfile
RUN yarn run build

# Production Dependencies Stage
FROM node:18-alpine AS prod-deps
ENV YARN_CACHE_FOLDER="/yarn_cache"
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile --ignore-scripts

# Final Stage
FROM node:18-alpine AS base
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 3000
CMD ["node", "dist/main"]
