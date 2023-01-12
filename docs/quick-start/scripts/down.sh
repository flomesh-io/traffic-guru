#!/bin/bash

cd $(dirname ${BASH_SOURCE})

set -e

echo "cleaning up"
k3d cluster delete traffic-guru
rm -f guru.kubeconfig