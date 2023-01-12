#!/bin/bash

cd $(dirname ${BASH_SOURCE})
. ./utils.sh

set -e

HOST_IP=$(if [ "$(uname)" == "Darwin" ]; then ipconfig getifaddr en0; else ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p'; fi) 
kubeconfig_guru=${KUBECONFIG_GURU:-"guru.kubeconfig"}
API_PORT=6443
DB_USER="flomesh"
DB_PWD="Flomesh1234"
DB_NAME="flomesh"
TRAFFIC_GURU_VERSION="0.0.7-7"
CLUSTER_NAME="traffic-guru"
NODE_PORT=30000
KUBE="kubectl --kubeconfig ${kubeconfig_guru}"

function check_command() {
    local installer="$2"
    if ! command -v $1 &> /dev/null
    then
        echo "$1 could not be found"
        if [[ -v $installer ]]; then
        exit 1
        fi
        echo "Installing $1"
        eval $installer
    else
        echo "command $1 - exists"
    fi
}

function wait_for_pods() {
    echo "waiting for pods to be ready"
    sleep 3
    $KUBE wait --for=condition=ready pod -n $1 --all --timeout=180s
}

function create_cluster() {
    echo "creating k3d cluster"
    k3d cluster create ${CLUSTER_NAME} \
    --image docker.io/rancher/k3s:v1.23.8-k3s2 \
    --api-port "${HOST_IP}:${API_PORT}" \
    --port "${NODE_PORT}:30000@server:0" \
    --servers-memory 4g \
    --k3s-arg "--disable=traefik@server:0" \
    --timeout 120s \
    --wait 
}

function install_deps() {
   echo "installing mysql database"
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install --kubeconfig ${kubeconfig_guru} mysql bitnami/mysql  --namespace mysql --create-namespace  \
    --set auth.database=${DB_NAME} \
    --set auth.username=${DB_USER} \
    --set auth.password=${DB_PWD} \
    --set auth.rootPassword=root

   wait_for_pods "mysql"

   echo "installing clickhouse server"
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install --kubeconfig ${kubeconfig_guru} clickhouse bitnami/clickhouse --namespace click-house --create-namespace \
    --set auth.username=flomesh \
    --set auth.password=password \
    --set shards=1 \
    --set replicaCount=1 \
    --set zookeeper.enabled=false

   wait_for_pods "click-house"
}

function install_traffic_guru() {
    echo "installing traffic guru"
    helm repo add flomesh https://flomesh-io.github.io/helm-charts
    helm install --kubeconfig ${kubeconfig_guru} traffic-guru flomesh/traffic-guru --namespace traffic-guru --create-namespace \
        --set gui.tag=${TRAFFIC_GURU_VERSION} \
        --set database.host=mysql.mysql.svc.cluster.local \
        --set database.port=3306 \
        --set database.username=${DB_USER} \
        --set database.password=${DB_PWD} \
        --set service.type=NodePort

    wait_for_pods "traffic-guru"
}

echo "Checking for pre-requiste commands"
# check for docker
check_command "docker"

# check for kubectl
check_command "kubectl"

# check for k3d
check_command "k3d" "curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash"

# check for helm
check_command "helm" "curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash"

# create cluster
create_cluster

k3d kubeconfig get ${CLUSTER_NAME} > "${kubeconfig_guru}"

# wait base pods up
sleep 5
wait_for_pods "kube-system"

# install dependent services
install_deps

# install traffic guru
install_traffic_guru

echo "Traffic Guru is installed and available. Login to GUI as"
echo "URL: http://${HOST_IP}:${NODE_PORT}/flomesh/"
echo "USER: admin"
echo "PASSWORD: flomesh123"

echo "Trying Logging in with demo credentials"
login

echo "Adding Clickhouse component"
add_component

echo "Adding Registry"
add_registry
