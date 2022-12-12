FROM node:16-alpine

ENV NODE_ENV production

##
# Prepare system dependencies
##

RUN apk add --no-cache bash ca-certificates git curl && \
    adduser -h /home/app -u 101 -D app

##
# Build app
##

USER root
WORKDIR /app

COPY package.json yarn.lock /app/
RUN NODE_ENV=development yarn install --frozen-lockfile && \
    yarn cache clean && \
    chown 101:101 -R /app

COPY --chown=101:101 . /app/
RUN yarn run build && \
    chown 101:101 -R /app && \
    chmod +x /app/bin/*.sh

##
# Prepare for execution
##

USER 101
ENV PORT=3000

EXPOSE 3000/tcp
HEALTHCHECK --interval=30s CMD ["/app/bin/readiness.sh"]

CMD ["/app/node_modules/.bin/next", "start"]
