pipeline {
    agent any

    tools {
        jdk 'Java17'
        maven 'Maven3'
    }

    environment {
        APP_NAME = "My-portfolio"
        RELEASE = "1.0.0"
        DOCKER_USER = "suryaprakashtiwarirj"
        DOCKER_PASS = credentials("docker-hub-credentials")  // Docker Hub credentials ID
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        GIT_USER = credentials('github-username')  // GitHub credentials ID for pushing changes
        GIT_PASS = credentials('github-token')    // GitHub token credentials ID
    }

    stages {
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: 'github', url: ''
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

        stage("Trivy File Scan") {
            steps {
                sh "trivy fs . > trivy.txt"
            }
        }

        stage("Build & Push Docker Image") {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker_image = docker.build "${IMAGE_NAME}"
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push("latest")
                    }
                }
            }
        }

        stage("Docker Scout Image") {
            steps {
                script {
                    // Run docker-scout inside a Docker container to scan the image
                    docker.image('docker:latest').inside {
                        // Authenticate to Docker Hub and scan the image with docker-scout
                        sh 'docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}'  // Login to Docker Hub
                        sh 'docker pull ${IMAGE_NAME}:${IMAGE_TAG}'  // Pull the image from Docker Hub
                        sh 'docker-scout quickview ${IMAGE_NAME}:${IMAGE_TAG}'  // Run quickview scan
                        sh 'docker-scout cves ${IMAGE_NAME}:${IMAGE_TAG}'  // Scan for CVEs (vulnerabilities)
                        sh 'docker-scout recommendations ${IMAGE_NAME}:${IMAGE_TAG}'  // Get recommendations for the image
                    }
                }
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
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/Ashfaque-9x/register-app.git main
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
    }

    post {
        success {
            emailext body: '${SCRIPT, template="groovy-html.template"}',
                     subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - Success",
                     mimeType: 'text/html',
                     to: "suryaprakashtiwari369@gmail.com"
        }

        failure {
            emailext body: '${SCRIPT, template="groovy-html.template"}',
                     subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - Failed",
                     mimeType: 'text/html',
                     to: "suryaprakashtiwari369@gmail.com"
        }
    }
}
