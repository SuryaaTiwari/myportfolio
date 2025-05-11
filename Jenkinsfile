pipeline {
    agent { label 'Jenkins-Agent' }

    tools {
        jdk 'Java17'
        maven 'Maven3'
    }

    environment {
        APP_NAME = "register-app-pipeline"
        RELEASE = "1.0.0"
        DOCKER_USER = "ashfaque9x"
        DOCKER_PASS = 'dockerhub'
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        JENKINS_API_TOKEN = credentials("JENKINS_API_TOKEN")
    }

    stages {
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/Ashfaque-9x/register-app'
            }
        }

        stage("Build Application") {
            steps {
                sh "mvn clean package"
            }
        }

        stage("Test Application") {
            steps {
                sh "mvn test"
            }
        }

        stage("SonarQube Analysis") {
            steps {
                script {
                    withSonarQubeEnv(credentialsId: 'jenkins-sonarqube-token') {
                        sh "mvn sonar:sonar"
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'jenkins-sonarqube-token'
                }
            }
        }

        stage("Build & Push Docker Image") {
            steps {
                script {
                    docker.withRegistry('', DOCKER_PASS) {
                        docker_image = docker.build "${IMAGE_NAME}"
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push("latest")
                    }
                }
            }
        }

        stage("Trivy Scan") {
            steps {
                sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image ${IMAGE_NAME}:${IMAGE_TAG} \
                    --no-progress --scanners vuln \
                    --exit-code 0 --severity HIGH,CRITICAL --format table
                """
            }
        }

        stage("Update GitOps Manifests") {
            steps {
                script {
                    sh """
                        git config user.email "ci@jenkins"
                        git config user.name "Jenkins"
                        sed -i 's|image: .*|image: ${IMAGE_NAME}:${IMAGE_TAG}|' kubernetes/deployment.yaml
                        git add kubernetes/deployment.yaml
                        git commit -m "Update image to ${IMAGE_NAME}:${IMAGE_TAG} from Jenkins"
                        git push https://$GIT_USER:$GIT_PASS@github.com/Ashfaque-9x/register-app.git main
                    """
                }
            }
        }

        stage("Cleanup Artifacts") {
            steps {
                sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
                sh "docker rmi ${IMAGE_NAME}:latest || true"
            }
        }

        stage("Trigger CD Job (Optional)") {
            steps {
                script {
                    sh """
                        curl -v -k --user clouduser:${JENKINS_API_TOKEN} -X POST \
                        -H 'cache-control: no-cache' \
                        -H 'content-type: application/x-www-form-urlencoded' \
                        --data 'IMAGE_TAG=${IMAGE_TAG}' \
                        'http://<JENKINS_URL>/job/gitops-register-app-cd/buildWithParameters?token=gitops-token'
                    """
                }
            }
        }
    }

    post {
        success {
            emailext body: '${SCRIPT, template="groovy-html.template"}',
                     subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - Success",
                     mimeType: 'text/html',
                     to: "ashfaque.s510@gmail.com"
        }

        failure {
            emailext body: '${SCRIPT, template="groovy-html.template"}',
                     subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - Failed",
                     mimeType: 'text/html',
                     to: "ashfaque.s510@gmail.com"
        }
    }
}
