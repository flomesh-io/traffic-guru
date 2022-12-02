## Traffic Guru

Traffic Guru provides a unified graphical interface for [PIPY](https://github.com/flomesh-io/pipy)'s microservice governance capabilities, allowing administrators to import Kubernetes clusters while assigning different cluster, namespace, and service management capabilities, including logging, tracing capabilities, etc. to users within the system through permission control. It allows developers to manage applications running in Kubernetes clusters and view their operational status, facilitating developers to better manage Kubernetes clusters.

## Functions

### Service Mesh

Traffic Guru comes with osm-edge Service Mesh an SMI (Service Mesh Interface) compatible, and provides a standard interface to the Kubernetes Service Mesh, a basic set of features for standard Service Mesh scenarios, the flexibility to provide new Service Mesh features, and a space for innovation in the Service Mesh technology ecosystem that is easy to use.

### Network Policies

Traffic Guru comes with Ingress/Egress controllers to allow you configure inbound and outbound services with the ease of point and click. You decide which servcies can be accessed from outside via HTTP/HTTPS routes and decide what services are allowed to access outside world.

### Multitenancy

Traffic Guru control panel allows you full control to add tenants with ease to allow multiple independent instances of one or multiple applications operate in a shared environment.

### Integrating non-k8s services

Traffic Guru understands that real world scenarios are more complex and its very common for enterprises to have disparate systems running on different platforms each with its own eco-system. Traffic Guru helps to let you integrate your existing systems via its unique GUI system, thus giving you full control to configure and operate all systems from one GUI.

### Operations Control Center

Traffic Guru control panel is a complex piece of software and comes with plethora of interfaces and options. You are given the full control to decide who is allowed to do what. Manage control panel components, View system stats, View/Query logs, manage SSL certificates and more.

### L4/L7 Load balancing (Enterprise Edition)

Traffic Guru comes with Software Load balancer and provides an administrative console to configure software load balancer on OSI Layer 4 and/or Layer 7. Software load balancer component provides different load balancing algorithms like Round Robin, Least Connections, Hash, etc; the choice of load balancing method depends on your needs:

### API Gateway (Enterprise Edition)

Traffic Guru comes with enterprise grade API gateway built on top of programmable proxy Pipy. Give you full control and ease of configuration to modernize legacy applications, deliver outstanding digital customer experiences, and accelerate your time to market. Traffic Guru comes with plugins, portal, analytics, advanced security, user interface etc.

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
### Server
- use `npm`
```bash
$ cd packages/server
$ npm install
$ npm run develop
``` 
- use `yarn`
```bash
$ cd packages/server
$ yarn install
$ yarn develop
``` 

### GUI
- use `npm`
```bash
$ cd packages/gui
$ npm install
$ npm run serve
```
- use `yarn`
```bash
$ cd packages/gui
$ yarn install
$ yarn serve
```

## License

Please refer to [LICENCE](/LICENSE.md).








