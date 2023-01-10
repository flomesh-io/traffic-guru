#!/bin/sh
set -e

if [[ "$1" == "gui" ]]; then
  if [[ "$2" == "docker-start" ]]; then
    shift 2
    # workaround for https://github.com/moby/moby/issues/31243
    chmod o+w /proc/self/fd/1 || true
    chmod o+w /proc/self/fd/2 || true

    if [ "$(id -u)" != "0" ]; then
      cd /usr/local/flomesh
      export NODE_ENV=production
      exec /usr/bin/npm start
    else
#      chown -R flomesh:0 /usr/local/flomesh
      export NODE_ENV=production
      cd /usr/local/flomesh
      exec su-exec flomesh  /usr/bin/npm start
    fi
  fi
  elif [[ "$1" == "migration" ]]; then
     cd /usr/local/flomesh
     exec su-exec flomesh /usr/bin/npm run db migration:run
     shift 1
  elif [[ "$1" == "migration-el7" ]]; then
     cd /usr/local/flomesh
     exec /usr/bin/npm run db migration:run
     shift 1
fi

exec "$@"
