#!/bin/bash

set -e

HOST_IP=$(if [ "$(uname)" == "Darwin" ]; then ipconfig getifaddr en0; else ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p'; fi) 
kubeconfig_guru=${KUBECONFIG_GURU:-"guru.kubeconfig"}
API_PORT=6443
DB_USER="flomesh"
DB_PWD="Flomesh1234"
DB_NAME="flomesh"
TRAFFIC_GURU_VERSION=${TRAFFIC_GURU_VERSION:-"0.0.7-11"}
CLUSTER_NAME=${CLUSTER_NAME:-"traffic-guru"}
NODE_PORT=${NODE_PORT:-30000}
KUBE="kubectl --kubeconfig ${kubeconfig_guru}"
JWT=""

INSTALL=true

if [ $# -eq 0 ]; then
    INSTALL=true
else
    if [ $1 == "install" ]; then
       INSTALL=true
    elif [ $1 == "uninstall" ]; then
       INSTALL=false
    else
        echo "invalid argument '$1' provided. "
        echo "if you need to install, you can invoke script without any argument or provide 'install' as argument"
        echo "if you need to destroy cluster, provide 'uninstall' as argument"
        exit 1
    fi
fi

function check_command() {
    local installer="$2"
    if ! command -v $1 &> /dev/null
    then
        echo "missing $1"
        if [ -z "${installer// }" ]; then
            exit 1
        fi
        echo "Installing $1"
        eval $installer
    else
        echo "found $1"
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

function login() {
    RET=$(curl --silent -X POST -H "Content-Type: application/json" \
        -d '{"query":"mutation($input: UsersPermissionsLoginInput!){login(input: $input){jwt,user{id,username,email,role{id,name,type,description}}}}","variables":{"input":{"identifier":"admin","password":"flomesh123"}},"update":null}' \
         http://$HOST_IP:$NODE_PORT/graphql)
    JWT=$(echo $RET |  jq -r '.data.login.jwt')
    if [ "$JWT" == "null" ]; then
      JWT=""
    fi
    if [ ! -z "$JWT" ]; then
        echo "Logged in successfully"
    else
        echo "Unable to login. Got error:"
        echo $RET | jq
        exit 1
    fi
}

function add_component() {
    RET=$(curl --silent -X POST -H "Content-Type: application/json" \
           -H "Authorization: Bearer $JWT" \
           -d '{"query":"mutation($input: createFleetInput){createFleet(input: $input){fleet{id}}}","variables":{"input":{"data":{"content":{"host":"clickhouse.click-house.svc.cluster.local","port":8123,"user":"flomesh","password":"password","database":"default"},"name":"clickhouse","type":"clickhouse","apply":true,"template":null}}}}' \
           http://$HOST_IP:$NODE_PORT/graphql
    )
    RESP=$(echo $RET | jq '.data.createFleet.fleet.id')
    if [ "$RESP" == "null" ]; then
      RESP=""
    fi
    if [ ! -z "$RESP" ]; then
      echo "Clickhouse component added with id $RESP"
    else
      echo "Unable to add Clickhouse component. Please add that manually"
       echo $RET | jq
    fi
}

function add_registry() {
    config=$(<${kubeconfig_guru})
    config="${config//$'\n'/"\n"}"
    RET=$(curl --silent -X POST http://$HOST_IP:$NODE_PORT/graphql \
           -H "Content-Type: application/json" \
           -H "Authorization: Bearer $JWT" \
           -d '{"query":"mutation($input: createRegistryInput){createRegistry(input: $input){registry{id}}}","variables":{"input":{"data":{"organization":null,"type":"k8s","name":"guru-cluster","config":"'"$config"'","content":{"credit":"","autoUpstream":false,"autoApplication":false,"isGateway":false,"gatewayPath":"","gatewayPort":0},"address":""}}}}' 
    )
    RESP=$(echo $RET | jq '.data.createRegistry.registry.id' )
    if [ "$RESP" == "null" ]; then
      RESP=""
    fi
    if [ ! -z "$RESP" ]; then
      echo "Registry added with id $RESP"
    else
      echo "Unable to add registry. Please add that manually"
      echo $RET | jq
    fi
}

if $INSTALL; then
    echo "Checking for pre-requiste commands"
    # check for docker
    check_command "docker"

    # check for kubectl
    check_command "kubectl"

    # check for k3d
    check_command "k3d" "curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash"

    # check for helm
    check_command "helm" "curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash"

    # check for jq
    check_command "jq" "sudo apt-get install jq -y"

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

    sleep 3
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
else
    echo "cleaning up"
    k3d cluster delete traffic-guru
    rm -f guru.kubeconfig
fi