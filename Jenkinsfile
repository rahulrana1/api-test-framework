pipeline {
    agent any

    triggers {
        cron(getCronJobTime())
    }

    environment {
        ENVIRONMENT_TO_TEST = getEnv_var()
        APITEST_CONTAINER_NAME = getContainerName("apitests")
    }

    parameters {
        choice(
            name: 'SEND_SLACK_MESSAGE',
            choices: ['true' , 'false'],
            description: 'To send results to slack')

        string(
            name: 'BRANCH',
            defaultValue: 'master',
            description: 'GIT branch for running tests')
    }

    stages {
        stage('🚜 GIT checkout') {
            steps {
                cleanWs()
                git branch: params.BRANCH,
                    credentialsId: 'acuit-jenkins',
                    url: 'yourGITurl'
            }
        }

        stage('👷 Build Image') {
            steps{
                sh './go build_integrationtest_docker_image'
            }
        }

        stage('API Tests') {
            steps {
                echo 'Running API tests... "$ENVIRONMENT_TO_TEST"'
                sh './go jenkins_execute_integrationtests_docker "$ENVIRONMENT_TO_TEST" '
                echo 'Completed Running API tests!'
            }

            post{
                always {
                    copyReportsFromDockerContainer()
                    copyAllureReportFromDockerContainer()
                    publishAllureReport('allure/allure-report', 'allure/allure-results')
                }
            }
        }

        stage('Slack Reporting') {
            when { expression { params.SEND_SLACK_MESSAGE.toBoolean() } }
            steps{
                slack currentBuild
            }
        }
    }
}

def getContainerName(type) {
    def name = env.JOB_NAME
    def date = new Date()
    def timeInMillsecs = date.getTime()
    return name + "_" + type + "_" + timeInMillsecs
}

def publishAllureReport(rawReportFolder, htmlresults){
    script {
        allure([
            includeProperties: false,
            jdk: '',
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: htmlresults]],
            report: rawReportFolder
        ])
    }
}

def copyReportsFromDockerContainer(){

sh """
    cont=\$(docker ps -aqf "name="$APITEST_CONTAINER_NAME"")
    docker cp \$cont:/app/results/. results
"""

}

def copyAllureReportFromDockerContainer(){

sh """
    cont=\$(docker ps -aqf "name="$APITEST_CONTAINER_NAME"")
    docker cp \$cont:/app/results/allure allure
"""

}

def getCronJobTime() {
    def name = env.JOB_NAME

    //jobs with conatining no cron in the name won't everyday
    if(name.contains('noCron')){
        return "";
    }
    if(name.contains('DEV')){
        return "H 10 * * 1-5";
    }

    if(name.contains('UAT')){
        return "H 07 * * 1-5";
    }

    if(name.contains('TEST')){
        return "H 08 * * 1-5";
    }

    if(name.contains('PROD')){
        return "H 09 * * 1-5";
    }
}

def getEnv_var() {
    def name = env.JOB_NAME

    if(name.contains('UAT')){
        return "UAT";
    }

    if(name.contains('TEST')){
        return "TEST";
    }

    if(name.contains('DEV')){
        return "DEV";
    }

    if(name.contains('PROD')){
        return "PROD";
    }
}

def slack(currentBuild) {
    echo "build result ${currentBuild.currentResult}"
    def colour = currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger'
    def msgSlack = readFile "./results/resultsForSlack.txt"

    echo "API tests report message ${msgSlack}"

    def finalMessage = "*Backend Microservices Results In ${env.ENVIRONMENT_TO_TEST}* : <${currentBuild.absoluteUrl}/allure/|Backend Microservices Report>\n${msgSlack}"
    slackSend channel: '#automation-testing', color: colour, message: finalMessage
}