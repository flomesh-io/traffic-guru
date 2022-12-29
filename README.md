<img src="./packages/gui/src/assets/img/logo2.png" width="200" alt="TrafficGuru Logo"/><br/>
## TrafficGuru
 
TrafficGuru is one stop GUI for cloud native traffic management of Service Mesh, Ingress, GatewayAPI, ELB, MCS, API management.

TrafficGuru from Flomesh is an open source one stop graphical console application for cloud native traffic management. It provides a multi-tenant, visual management console for management of Service Mesh, Software Load Balancing, API Management, Ingress/Egress, ELB, MCS (Multi-Cluster Services).
TrafficGuru with the basis of micro-service registry provides traffic management capabilities and unified service governance, identity management, access control and other capabilities for multiple micro service technology stacks. It supports Kubernetes based services, services running on virtual machine, physical machine, or running on third party micro service runtime environments.
TrafficGuru web console provides both administrator-oriented and normal user-oriented operation views; provides multi-level organization management, project management, access management, and provides multi-tenant application traffic management capabilities for medium to large organizations.
TrafficGuru is built on top of Strapi, and comes integrated with various other tools like prometheus, jaeger, etc. TrafficGuru is designed to be  flexible with scalability at its core, so that users can quickly (or even zero code) extend and customize the management logic to meet their own needs.

## Functions

### Service Mesh

TrafficGuru comes with osm-edge Service Mesh an SMI (Service Mesh Interface) compatible, and provides a standard interface to the Kubernetes Service Mesh, a basic set of features for standard Service Mesh scenarios, the flexibility to provide new Service Mesh features, and a space for innovation in the Service Mesh technology ecosystem that is easy to use.
![Service Mesh](https://flomesh.io/img/screen/point2.jpg)

### Network Policies

TrafficGuru comes with Ingress/Egress controllers to allow you configure inbound and outbound services with the ease of point and click. You decide which servcies can be accessed from outside via HTTP/HTTPS routes and decide what services are allowed to access outside world.
![Network Policies](https://flomesh.io/img/screen/point3.jpg)

### Multitenancy

TrafficGuru control panel allows you full control to add tenants with ease to allow multiple independent instances of one or multiple applications operate in a shared environment.
![Multitenancy](https://flomesh.io/img/screen/point5.jpg)

### Integrating non-k8s services

TrafficGuru understands that real world scenarios are more complex and its very common for enterprises to have disparate systems running on different platforms each with its own eco-system. TrafficGuru helps to let you integrate your existing systems via its unique GUI system, thus giving you full control to configure and operate all systems from one GUI.
![Integrating non-k8s services](https://flomesh.io/img/screen/point6.jpg)

### Operations Control Center

TrafficGuru control panel is a complex piece of software and comes with plethora of interfaces and options. You are given the full control to decide who is allowed to do what. Manage control panel components, View system stats, View/Query logs, manage SSL certificates and more.
![Operations Control Center](https://flomesh.io/img/screen/point7.jpg)  

### L4/L7 Load balancing (Enterprise Edition)

TrafficGuru comes with Software Load balancer and provides an administrative console to configure software load balancer on OSI Layer 4 and/or Layer 7. Software load balancer component provides different load balancing algorithms like Round Robin, Least Connections, Hash, etc; the choice of load balancing method depends on your needs:
![L4/L7 Load balancing](https://flomesh.io/img/screen/point1.jpg)

### API Gateway (Enterprise Edition)

TrafficGuru comes with enterprise grade API gateway built on top of programmable proxy Pipy. Give you full control and ease of configuration to modernize legacy applications, deliver outstanding digital customer experiences, and accelerate your time to market. TrafficGuru comes with plugins, portal, analytics, advanced security, user interface etc.
![API Gateway](https://flomesh.io/img/screen/point4.jpg)

## Requirements

- A running PIPY
- Nodejs >= 14 , < 16
- Npm | Yarn

Database:
|        Database        |           Minimum            |      Recommended      |
| :-----------: | :-----------: | :--------: |
|  MySQL   |        5.7.8        |     8.0             |
|  PostgreSQL   |          11.0         |            14.0       

## Configuration

pipy.js
database.js

## Envionment variables

|        VAR        |           DESCRIPTION            |      VALUES      |
| :---------------: | :------------------------------: | :--------------: |
|  PIPY_REPO_HOST   |        PIPY repo location        |                  |
|  PIPY_REPO_PORT   |          PIPY repo port          |                  |
|   DATABASE_HOST   |          Database host           |                  |
|   DATABASE_PORT   |          Database port           |                  |
| DATABASE_USERNAME |        Database username         |                  |
| DATABASE_PASSWORD |        Database password         |                  |
|   DATABASE_TYPE   | Database type (default is mysql) | default,postgres |
|                   |                                  |                  |


## Getting Started
### Install
- use `npm`
```bash
$ npm run setup
``` 
- use `yarn`
```bash
$ yarn setup
``` 

### Run Server
- use `npm`
```bash
$ npm run serve:server
``` 
- use `yarn`
```bash
$ yarn serve:server
``` 

### Run GUI
- use `npm`
```bash
$ npm run serve:gui
```
- use `yarn`
```bash
$ yarn serve:gui
```

### ClickHouse
- Install ClickHouse
Please refer to [quick-start](https://clickhouse.com/docs/en/quick-start/).
- Add the ClickHouse configuration on the registry page

![ clickhouse configuration](./doc/images/clickhouse.png)

|     VAR     |           DESCRIPTION            |
| :---------: | :------------------------------: |
|  host       |        ClickHouse host           | 
|  port       |        ClickHouse port           |
|  database   |        Database name             |
|  user       |        ClickHouse user           |
|  password   |        ClickHouse password       |


### K8s & DashBoard
- Install K8s
Please refer to [kubernetes-doc](https://kubernetes.io/docs/home/).
- Install DashBoard
Please refer to [web-ui-dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/).
- Add the K8s configuration on the registry page

![ K8s configuration](./doc/images/k8s.png)

|        VAR        |           DESCRIPTION            |
| :---------------: | :------------------------------: |
|  Name             |        Registry name             | 
|  Type             |        Registry type             |
|  Trust Domain     |        Registry Trust Domain     |
|  Dashboard Port   |        K8s Dashboard Port        |
|  Location         |        K8s Api address           |
|  Credit           |        K8s Token                 |
|  Certificate      |        K8s CA cert               |

## Homepage: 
https://flomesh.io/traffic-guru

## License

Please refer to [LICENCE](/LICENSE.md).








