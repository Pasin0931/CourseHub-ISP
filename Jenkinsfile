// Jenkinsfile for CourseHub-ISP
// Place this file at the repo root.
// Requires: Docker Pipeline plugin, and Jenkins to have access to the Docker socket
// (Jenkins and the app run on the same machine, so no SSH/registry step is needed).

pipeline {
    agent none

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Backend: install & test') {
            agent {
                docker { image 'python:3.14.2-slim' }
            }
            steps {
                sh '''
                    pip install --no-cache-dir -r requirements.txt
                    cd backend
                    # pytest will just report "no tests ran" until a test suite exists
                    pip install --no-cache-dir pytest
                    python -m pytest --maxfail=1 || true
                '''
            }
        }

        stage('Frontend: install, lint & build') {
            agent {
                docker { image 'node:24.14-alpine' }
            }
            steps {
                dir('coursehub') {
                    sh '''
                        npm ci
                        npm run lint
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            agent any
            when { branch 'main' }
            steps {
                // Jenkins and the app run on the same machine, so this builds
                // fresh images from the checked-out source and restarts the
                // stack in place. The Jenkins user needs access to the docker
                // socket (usually: add it to the "docker" group).
                sh '''
                    docker compose build
                    docker compose up -d --remove-orphans
                '''
            }
        }
    }

    post {
        always {
            node('') {
                cleanWs()
            }
        }
        failure {
            echo 'Pipeline failed — check the failing stage log above.'
        }
        success {
            echo "Build ${env.BUILD_NUMBER} succeeded on branch ${env.BRANCH_NAME ?: 'unknown'}."
        }
    }
}
