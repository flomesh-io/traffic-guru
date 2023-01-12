# Traffic Guru demo environment setup

Provided scripts will help to setup and tear down cluste and traffic-guru application.

## Try it out

**Requires**

* [Docker](https://docs.docker.com/get-docker/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)

To setup the traffic-guru:

- `scripts/up.sh` - to create and setup 1 demo `k3d` cluster
- `scripts/down.sh` - to tear down cluster

Once Traffic-Guru is up and running, you can follow [`quick-start`](quick-start.md) guide to complete the GUI operations.
