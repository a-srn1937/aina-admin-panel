# Stage 1: Build Node.js package
FROM node:20-alpine

ARG BUILD_STATIC_EXPORT=false
ARG NEXT_PUBLIC_ASSETS_DIR=
ARG NEXT_PUBLIC_SERVER_URL=https://api.aina.vision/api
ARG SOURCE_COMMIT
ARG COOLIFY_URL
ARG COOLIFY_FQDN
ARG COOLIFY_BRANCH
ARG COOLIFY_RESOURCE_UUID
ARG COOLIFY_CONTAINER_NAME

#ENV http_proxy="http://172.20.1.224:5432"
#ENV https_proxy="http://172.20.1.224:5432"

#RUN apk add --no-cache curl \
# && curl -o- -L https://yarnpkg.com/install.sh | sh \
# && apk del curl

ENV NODE_ENV=production \
    NEXT_PUBLIC_ASSETS_DIR="${NEXT_PUBLIC_ASSETS_DIR}" \
    NEXT_PUBLIC_SERVER_URL="${NEXT_PUBLIC_SERVER_URL}" \
    PATH="/root/.yarn/bin:/root/.config/yarn/global/node_modules/.bin:${PATH}"

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3004

CMD ["yarn", "start"]
