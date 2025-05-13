pipeline {
    agent any

    tools {
        jdk 'Java17'         // If you are using JDK for any Java-related tasks
        maven 'Maven3'       // If you still need Maven for any other tasks
        nodejs 'NodeJS'      // NodeJS tool configured in Jenkins
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
                git branch: 'master', credentialsId: 'github', url: 'https://github.com/SuryaaTiwari/myportfolio.git'
            }
        }

        stage("Install Dependencies") {
            steps {
                script {
                    // Install npm dependencies
                    sh "npm install"
                }
            }
        }

        stage("Build Application") {
            steps {
                script {
                    // Run your build command, like `npm run build` if you have it in package.json
                    sh "npm run build"
                }
            }
        }

        stage("Test Application") {
            steps {
                script {
                    // Run tests using npm (assuming `npm test` is configured)
                    sh "npm test"
                }
            }
        }

        stage("SonarQube Analysis") {
            environment {
                scannerHome = tool 'sonar6.2.1'
            }

            steps {
                script {
                    // Use the SonarQube Scanner installed in Jenkins
                    withSonarQubeEnv('sonarserver') {
                        // Run the sonar-scanner with proper arguments
                        sh '''${scannerHome}/bin/sonar-scanner -Dsonar.projectName=myportfolio \
                    -Dsonar.projectKey=myportfolio '''
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
                        git push https://${GIT_USER}:${GIT_PASS}@https://github.com/SuryaaTiwari/myportfolio.git master
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
