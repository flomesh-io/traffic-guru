<img src="https://raw.githubusercontent.com/flomesh-io/traffic-guru/main/packages/gui/src/assets/img/logo2.png" width="200" alt="TrafficGuru Logo"/><br/>
# TrafficGuru
 
TrafficGuru is one stop GUI for cloud native traffic management of Service Mesh, Ingress, GatewayAPI, ELB, MCS, API management.

TrafficGuru from Flomesh is an open source one stop graphical console application for cloud native traffic management. It provides a multi-tenant, visual management console for management of Service Mesh, Software Load Balancing, API Management, Ingress/Egress, ELB, MCS (Multi-Cluster Services).
TrafficGuru with the basis of micro-service registry provides traffic management capabilities and unified service governance, identity management, access control and other capabilities for multiple micro service technology stacks. It supports Kubernetes based services, services running on virtual machine, physical machine, or running on third party micro service runtime environments.
TrafficGuru web console provides both administrator-oriented and normal user-oriented operation views; provides multi-level organization management, project management, access management, and provides multi-tenant application traffic management capabilities for medium to large organizations.
TrafficGuru is built on top of Strapi, and comes integrated with various other tools like prometheus, jaeger, etc. TrafficGuru is designed to be  flexible with scalability at its core, so that users can quickly (or even zero code) extend and customize the management logic to meet their own needs.


This chart bootstraps a [Traffic Guru](https://flomesh.io/traffic-guru) deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.


## Prerequisites

- Kubernetes 1.16+
- Helm 3.7+

## Get Repository Info

```console
helm repo add flomesh https://flomesh-io.github.io/helm-charts
helm repo update
```

_See [helm repository](https://helm.sh/docs/helm/helm_repo/) for command documentation._

## Install traffic-guru


```console
helm install traffic-guru flomesh/traffic-guru \
 --namespace flomesh --create-namespace
```
_See [configuration](#configuration) below._

_See [helm install](https://helm.sh/docs/helm/helm_install/) for command documentation._

## Dependencies

By default this chart installs additional, dependent charts:

- [mariadb](https://mariadb.org/)
- [clickhouse](https://clickhouse.com/)
- [prometheus](https://prometheus.io/)

To disable the dependency during installation, set `mariadb.enabled`, `clickhouse.enabled`, and `prometheus.enabled` to `false`.

## Use external database

### MySQL/Mariadb

```
helm install traffic-guru flomesh/traffic-guru \
    --namespace flomesh \
    --create-namespace \
    --set=mariadb.enabled=false \
    --set=externalDatabase.host=<db addr> \
    --set=externalDatabase.port=<db port> \
    --set=externalDatabase.user=<db user> \
    --set=externalDatabase.password=<db password>
```

## PostgreSQL

```
helm install traffic-guru flomesh/traffic-guru \
    --namespace flomesh \
    --create-namespace \
    --set=mariadb.enabled=false \
    --set=externalDatabase.type=postgres \
    --set=externalDatabase.host=<db addr> \
    --set=externalDatabase.port=<db port> \
    --set=externalDatabase.user=<db user> \
    --set=externalDatabase.password=<db password>
```

_See [helm dependency](https://helm.sh/docs/helm/helm_dependency/) for command documentation._

## Uninstall Chart

```console
helm uninstall [RELEASE_NAME]
```

This removes all the Kubernetes components associated with the chart and deletes the release.

_See [helm uninstall](https://helm.sh/docs/helm/helm_uninstall/) for command documentation._

## Updating values.schema.json

A [`values.schema.json`](https://helm.sh/docs/topics/charts/#schema-files) file has been added to validate chart values. When `values.yaml` file has a structure change (i.e. add a new field, change value type, etc.), modify `values.schema.json` file manually or run `helm schema-gen values.yaml > values.schema.json` to ensure the schema is aligned with the latest values. Refer to [helm plugin `helm-schema-gen`](https://github.com/karuppiah7890/helm-schema-gen) for plugin installation instructions.

## Upgrading Chart

```console
helm upgrade [RELEASE_NAME] [CHART] --install
```

_See [helm upgrade](https://helm.sh/docs/helm/helm_upgrade/) for command documentation._


## Configuration

See [Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing). To see all configurable options with detailed comments, visit the chart's [values.yaml](./values.yaml), or run these configuration commands:

```console
helm show values flomesh/traffic-guru
```

You may similarly use the above configuration commands on each chart [dependency](#dependencies) to see it's configurations.
