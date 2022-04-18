#!/bin/bash

API_REQUEST_YML=${1:-"deploy_service.yml"}
IMAGE_NAME=${IMAGE_NAME:-"$SERVICE_NAME"}
RUNTIME_ENV=${RUNTIME_ENV:-"echo '(No additional runtime environment set)'"}

function errEx() {
  RC=$?
  if test "$RC" != "0"
    then
    echo "ERROR ERROR ERRORR $1" && exit 69
  fi
}

# Check if Kube Config is available
if [ -z "$KUBE_CONFIG" ]; then
    echo "\$KUBE_CONFIG not set! Exiting..."
    exit 1
fi

# Write Kube Config
mkdir -p ~/.kube
echo $KUBE_CONFIG | base64 -d >> ~/.kube/config

# Open SSH Tunnel to Cluster
mkdir -p ~/.ssh
echo $CLUSTER_SSH_KEY | base64 -d > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh -o StrictHostKeyChecking=no -fN -L 0.0.0.0:6443:46.38.243.138:6443 root@46.38.243.138

eval "echo -n \"$(cat $API_REQUEST_YML)\"" > $API_REQUEST_YML

# Patch Deployment
echo "Patching Deployment $SERVICE_NAME with newer Image $DOCKER_REGISTRY/discord/$SERVICE_NAME:$CI_PIPELINE_ID..."
echo "Patch: \n-----------\n"
cat $API_REQUEST_YML
echo "\n-----------\n"

kubectl -n discord apply -f $API_REQUEST_YML || exit 10