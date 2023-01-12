#!/bin/bash

JWT=""

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
           -d '{"query":"mutation($input: createFleetInput){createFleet(input: $input){fleet{id}}}","variables":{"input":{"data":{"content":{"host":"clickhouse.click-house.svc.cluster.local","port":8123,"user":"“flomesh”","password":"password","database":"default"},"name":"clickhouse","type":"clickhouse","apply":true,"template":null}}}}' \
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
