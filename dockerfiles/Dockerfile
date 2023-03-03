FROM alpine:3.14 as builder
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

FROM alpine:3.14
LABEL maintainer="Kevein Liu<kevein@flomesh.cn>"

ARG RELEASE_VERSION
ENV RELEASE_VERSION=${RELEASE_VERSION:-0.70.0}

ARG REVISION
ENV REVISION=${REVISION:-1}

ENV NODE_VERSION 14.20.1-r0
ENV NPM_VERSION 7.17.0-r0

ENV APP_VERSION=free

COPY --from=builder /etc/flomesh /etc/flomesh
COPY --from=builder /usr/local/flomesh /usr/local/flomesh

RUN adduser -Su 1338 flomesh \
    && apk add --no-cache --virtual .build-deps tar \
    && apk add --no-cache npm=${NPM_VERSION} openssl su-exec tzdata curl vips-dev \
    && curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | sh \
    && curl -L -o /usr/local/bin/kubectl "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/$(uname -m | sed -E 's/x86_/amd/;s/aarch/arm/' )/kubectl" \
    && chmod +x /usr/local/bin/kubectl \
    && apk del .build-deps tar \
    && chown -R flomesh:0 /usr/local/flomesh \
    && ln -s /usr/local/flomesh/public/flomesh /usr/local/flomesh/public/flomesh-gui \
    && chmod -R g=u /usr/local/flomesh

COPY dockerfiles/docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 8080

CMD ["gui", "docker-start"]
