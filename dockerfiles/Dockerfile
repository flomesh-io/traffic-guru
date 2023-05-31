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
    && apk --no-cache add --virtual builds-deps build-base python3 git curl \
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

RUN cd /tmp \
    mkdir -p ${pkg_prefix}/flomesh/config/website/pipybin/GeneralLinux-x64/ \
    && curl -LO https://pipy-oss-1255617643.cos-website.ap-beijing.myqcloud.com/repo/pipy/x86_64/binary/pipy-0.90.1-157-generic_linux-x86_64.tar.gz \
    && tar xvf pipy-0.90.1-157-generic_linux-x86_64.tar.gz \
    && mv usr/local/bin/pipy ${pkg_prefix}/flomesh/config/website/pipybin/GeneralLinux-x64/

RUN cd /tmp \
    && mkdir -p ${pkg_prefix}/flomesh/config/website/pipybin/GeneralLinux-ARM/ \
    && curl -LO https://pipy-oss-1255617643.cos-website.ap-beijing.myqcloud.com/repo/pipy/aarch64/binary/pipy-0.90.1-157-generic_linux-aarch64.tar.gz \
    && tar xvf pipy-0.90.1-157-generic_linux-aarch64.tar.gz \
    && mv usr/local/bin/pipy ${pkg_prefix}/flomesh/config/website/pipybin/GeneralLinux-ARM/

RUN cd /tmp \
    && mkdir -p ${pkg_prefix}/flomesh/config/website/pipybin/MacOS-ARM/ \
    && curl -LO https://pipy-oss-1255617643.cos-website.ap-beijing.myqcloud.com/repo/pipy/aarch64/binary/pipy-0.90.1-10-darwin-aarch64.tar.gz \
    && tar xvf pipy-0.90.1-10-darwin-aarch64.tar.gz \
    && mv bin/pipy ${pkg_prefix}/flomesh/config/website/pipybin/MacOS-ARM/

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
    && curl -L -o /usr/local/bin/kubectl "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/$(uname -m | sed -E 's/x86_/amd/;s/aarch/arm/' )/kubectl" \
    && chmod +x /usr/local/bin/kubectl \
    && apk del .build-deps tar \
    && ln -s /usr/local/flomesh/public/flomesh /usr/local/flomesh/public/flomesh-gui

COPY dockerfiles/docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 8080

CMD ["gui", "docker-start"]
