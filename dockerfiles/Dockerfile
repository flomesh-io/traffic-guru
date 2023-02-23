FROM alpine:3.16 as builder
LABEL maintainer="Kevein Liu<kevein@flomesh.cn>"

ARG RELEASE_VERSION
ENV RELEASE_VERSION=${RELEASE_VERSION:-0.70.0}

ARG REVISION
ENV REVISION=${REVISION:-2}

ENV pkg_prefix     /usr/local
ENV pkg_confdir    /etc/flomesh

COPY packages /packages

RUN apk add --no-cache openssh-client nodejs npm alpine-sdk linux-headers musl vips vips-dev \
    && apk --no-cache add --virtual builds-deps build-base python3 git \
    && ln -sfn /usr/bin/python3 /usr/bin/python \
    && npm install -g node-pre-gyp pkg yarn \
    && npm rebuild bcrypt --build-from-source

RUN cd /packages/server/ \
    && yarn config set network-timeout 300000 \
    && yarn install \
    && NODE_ENV=production yarn build \
    && mkdir -p ${pkg_prefix}/flomesh/public/flomesh ${pkg_confdir} \
    && cp -r . ${pkg_prefix}/flomesh \
    && cp .env.example ${pkg_confdir}/env

RUN cd /packages/gui \
    && yarn config set network-timeout 300000 \
    && yarn install \
    && yarn build

RUN cp -r /packages/gui/dist/*  ${pkg_prefix}/flomesh/public/flomesh/

############## Stage Build End ################

FROM alpine:3.16
LABEL maintainer="Kevein Liu<kevein@flomesh.cn>"

ARG RELEASE_VERSION
ENV RELEASE_VERSION=${RELEASE_VERSION:-0.70.0}

ARG REVISION
ENV REVISION=${REVISION:-1}

ENV APP_VERSION=free

RUN adduser -Su 1338 flomesh

COPY --from=builder --chown=flomesh:0 /etc/flomesh /etc/flomesh
COPY --from=builder --chown=flomesh:0 /usr/local/flomesh /usr/local/flomesh

RUN apk add --no-cache --virtual .build-deps tar \
    && apk add --no-cache npm openssl su-exec tzdata curl vips-dev \
    && curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | sh \
    && apk del .build-deps tar \
    && ln -s /usr/local/flomesh/public/flomesh /usr/local/flomesh/public/flomesh-gui

COPY dockerfiles/docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 8080

CMD ["gui", "docker-start"]
