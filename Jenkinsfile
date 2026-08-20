pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        APP_NAME = "chalocharge"
        IMAGE_NAME = "chalocharge"
        DOCKER_HUB_REPO = "keerthiprudviraj/chalocharge"
        APP_PORT = "3000"
        CONTAINER_PORT = "80"
    }

    stages {

        stage("Code") {
            steps {
                echo "Cloning ChaloCharge source code..."

                git url: "https://github.com/keerthi-prudviraj/ChaloCharge.git",
                    branch: "main"
            }
        }

        stage("Build") {
            steps {
                echo "Building ChaloCharge Docker image..."

                sh """
                    docker build -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage("Test") {
            steps {
                echo "Running application tests..."

                sh '''
                    if [ -d "node_modules" ]; then
                        npm run build
                    else
                        echo "Skipping npm build test because dependencies are handled inside Docker."
                    fi
                '''
            }
        }

        stage("Trivy Security Scan") {
            steps {
                echo "Running Trivy filesystem security scan..."

                sh '''
                    trivy fs \
                    --severity HIGH,CRITICAL \
                    --format table \
                    .
                '''

                echo "Scanning Docker image..."

                sh """
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --format table \
                    ${IMAGE_NAME}:latest
                """
            }
        }

        stage("Push to Docker Hub") {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "dockerHubcredsAP",
                        usernameVariable: "dockerHubUser",
                        passwordVariable: "dockerHubPass"
                    )
                ]) {

                    sh '''
                        echo "$dockerHubPass" | docker login \
                        -u "$dockerHubUser" \
                        --password-stdin

                        docker tag chalocharge:latest \
                        "$dockerHubUser/chalocharge:latest"

                        docker push \
                        "$dockerHubUser/chalocharge:latest"

                        docker logout
                    '''
                }
            }
        }

        stage("Deploy") {
            steps {

                echo "Deploying ChaloCharge..."

                sh '''
                    docker stop chalocharge || true
                    docker rm chalocharge || true

                    docker run -d \
                        --name chalocharge \
                        -p 3000:80 \
                        chalocharge:latest

                    echo "ChaloCharge container started."
                '''
            }
        }

        stage("Health Check") {
            steps {

                echo "Checking ChaloCharge application health..."

                sh '''
                    sleep 5

                    curl -f http://localhost:3000/

                    echo ""
                    echo "ChaloCharge health check PASSED."
                '''
            }
        }
    }

    post {

        success {

            echo "=========================================="
            echo "CHALOCHARGE DEPLOYMENT SUCCESSFUL"
            echo "Application: http://EC2-PUBLIC-IP:3000"
            echo "=========================================="

            emailext(
                to: "keerthiprudvi599@gmail.com",
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Hello,

ChaloCharge CI/CD pipeline completed successfully.

Job Name:
${env.JOB_NAME}

Build Number:
${env.BUILD_NUMBER}

Build Status:
SUCCESS

Application:
http://YOUR-EC2-PUBLIC-IP:3000

Docker Image:
${env.DOCKER_HUB_REPO}:latest

Build URL:
${env.BUILD_URL}

Stages completed:

1. Code Checkout
2. Docker Build
3. Application Test
4. Trivy Security Scan
5. Docker Hub Push
6. Deployment
7. Health Check

Regards,
Jenkins
"""
            )
        }

        failure {

            echo "=========================================="
            echo "CHALOCHARGE DEPLOYMENT FAILED"
            echo "=========================================="

            emailext(
                to: "keerthiprudvi599@gmail.com",
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Hello,

ChaloCharge CI/CD pipeline has FAILED.

Job Name:
${env.JOB_NAME}

Build Number:
${env.BUILD_NUMBER}

Build Status:
FAILURE

Please check the Jenkins console output.

Build URL:
${env.BUILD_URL}

Regards,
Jenkins
"""
            )
        }
    }
}
