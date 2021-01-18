#!/bin/bash

function target_build_integrationtest_docker_image() {
    docker build -t api-integration-tests -f Docker/dockerfile .
}

function target_execute_integrationtests_docker() {
    echo "execute_integrationtests_docker(): \$1 is $1"
    echo "execute_integrationtests_docker(): \$2 is $2"
    if [ ! -z "$1" ] && [ ! -z "$2" ]
    then
        docker run -i -e ENVIRONMENT_TO_TEST=$1 -e TEST_TO_RUN=$2 api-integration-tests npm run test
    else
        echo "execute_integrationtests_docker needs two paramters which were not defined, first is for environment and second is for test to run. check readme for more info."
        exit 1
    fi
}

function target_jenkins_execute_integrationtests_docker() {
    echo "jenkins_execute_integrationtests_docker(): \$1 is $1"
    if [ ! -z "$1" ]
    then
        docker run -i -e ENVIRONMENT_TO_TEST=$1 --name "$APITEST_CONTAINER_NAME" api-integration-tests npm run tests:jenkins
    else
        echo "jenkins_execute_integrationtests_docker needs two paramters which were not defined, first is for environment and second is for test to run. check readme for more info."
        exit 1
    fi
}

function setEnvVariables() {
    input=".env"
    while IFS= read -r line; do
        arrIN=(${line//=/ })
        export ${arrIN[0]}=${arrIN[1]}
    done <"$input"
}

if type -t "target_$1" &>/dev/null; then
    #setEnvVariables
    target_$1 ${@:2}
else
    echo "usage: $0 <target>
target:

    build_integrationtest_docker_image          --      Use this to build docker image for running integration tests
    execute_integrationtests_docker             --      Run integration tests. It accepts two parameters, first one for env(DEV,TEST & UAT) and second for name of the test.
    jenkins_execute_integrationtests_docker     --      Run integration tests in parallel in Jenkins
"
    exit 1
fi