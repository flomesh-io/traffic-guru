# Installation guide

[[_TOC_]]

## Prerequisite

Before installing Flomesh OpenShift, you need to setup a database beforehand:

* MySQL >= 5.7
* PostgreSQL >= v12

and create a database named `flomesh`, otherwide you need to set the database name.

## Install the Flomesh OpenShift

1. Add helm repo:

   ```
   helm repo add flomesh https://flomesh-io.github.io/helm-charts
   ```

2. Install the repo

   If you are using MySQL

   ```
   helm install \
   	--create-namespace \
   	--namespace flomesh-console \
   	flomesh-console \
   	flomesh/flomesh-console \
   	--set database.host=<db addr> \
   	--set database.user=<db user> \
   	--set database.password=<db password> \
   	--set service.type=NodePort
   ```

   If you are using PostgreSQL

   ```
   helm install \
   	--create-namespace \
   	--namespace flomesh-console \
   	flomesh-console \
   	flomesh/flomesh-console \
   	--set database.type=postgres \
   	--set database.host=<db addr> \
   	--set database.port=5432 \
   	--set database.user=<db user> \
   	--set database.password=<db password> \
   	--set service.type=NodePort
   ```

   if the cluster has ingress enabled, you could configure ingress during installation with option `ingress.enabled=true` and set your ingress host with `ingress.host`
   ```
   helm install \
   	--create-namespace \
   	--namespace flomesh-console \
   	flomesh-console \
   	flomesh/flomesh-console \
   	--set database.host=<db addr> \
   	--set database.user=<db user> \
   	--set database.password=<db password> \
   	--set ingress.enabled=true \
   	--set ingress.host=<your domain name here>
   ```

