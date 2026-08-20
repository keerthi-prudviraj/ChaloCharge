pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/keerthi-prudviraj/ChaloCharge.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t chalocharge:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop chalocharge || true
                    docker rm chalocharge || true

                    docker run -d \
                      --name chalocharge \
                      -p 3000:80 \
                      chalocharge:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 5
                    curl -f http://localhost:3000/
                '''
            }
        }
    }

    post {
        success {
            echo 'ChaloCharge deployment successful!'
        }

        failure {
            echo 'ChaloCharge deployment failed!'
        }
    }
}
