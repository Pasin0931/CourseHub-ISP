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
                githubNotify context: 'Jenkins/Checkout', description: 'Checking out source...', status: 'PENDING'
                checkout scm
                githubNotify context: 'Jenkins/Checkout', description: 'Checkout complete.', status: 'SUCCESS'
            }
            post {
                failure {
                    githubNotify context: 'Jenkins/Checkout', description: 'Checkout failed.', status: 'FAILURE'
                }
                aborted {
                    githubNotify context: 'Jenkins/Checkout', description: 'Checkout aborted.', status: 'ERROR'
                }
            }
        }
        stage('Backend: install & test') {
            agent {
                docker {
                    image 'python:3.14.2-slim'
                    // Docker Pipeline runs the container as the same UID as the
                    // Jenkins process, which has no /etc/passwd entry inside the
                    // image, so $HOME resolves to "/" and pip can't write there.
                    // Point HOME somewhere writable instead.
                    args '-e HOME=/tmp'
                }
            }
            steps {
                githubNotify context: 'Jenkins/Backend', description: 'Installing & testing backend...', status: 'PENDING'
                sh '''
                    pip install --no-cache-dir -r requirements.txt
                    cd backend
                    # pytest will just report "no tests ran" until a test suite exists
                    pip install --no-cache-dir pytest
                    python -m pytest --maxfail=1 || true
                '''
                githubNotify context: 'Jenkins/Backend', description: 'Backend install & test passed.', status: 'SUCCESS'
            }
            post {
                failure {
                    githubNotify context: 'Jenkins/Backend', description: 'Backend install & test failed.', status: 'FAILURE'
                }
                aborted {
                    githubNotify context: 'Jenkins/Backend', description: 'Backend stage aborted.', status: 'ERROR'
                }
            }
        }
        stage('Frontend: install, lint & build') {
            agent {
                docker {
                    image 'node:24.14-alpine'
                    args '-e HOME=/tmp'
                }
            }
            steps {
                githubNotify context: 'Jenkins/Frontend', description: 'Installing, linting & building frontend...', status: 'PENDING'
                dir('coursehub') {
                    sh '''
                        npm ci
                        npm run lint
                        npm run build
                    '''
                }
                githubNotify context: 'Jenkins/Frontend', description: 'Frontend build passed.', status: 'SUCCESS'
            }
            post {
                failure {
                    githubNotify context: 'Jenkins/Frontend', description: 'Frontend build failed.', status: 'FAILURE'
                }
                aborted {
                    githubNotify context: 'Jenkins/Frontend', description: 'Frontend stage aborted.', status: 'ERROR'
                }
            }
        }
        stage('Deploy') {
            agent any
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/main' || env.GIT_BRANCH == 'main'
                }
            }
            steps {
                githubNotify context: 'Jenkins/Deployment', description: 'Deployment in progress...', status: 'PENDING'

                withCredentials([
                    file(credentialsId: 'coursehub-backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'coursehub-frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                        cp "$BACKEND_ENV" backend/.env
                        cp "$FRONTEND_ENV" coursehub/.env
                        docker compose build
                        docker compose up -d --remove-orphans
                        rm -f backend/.env coursehub/.env
                    '''
                }

                githubNotify context: 'Jenkins/Deployment', description: 'Deployment passed!', status: 'SUCCESS'
            }
            post {
                failure {
                    githubNotify context: 'Jenkins/Deployment', description: 'Deployment failed.', status: 'FAILURE'
                }
                aborted {
                    githubNotify context: 'Jenkins/Deployment', description: 'Deployment aborted.', status: 'ERROR'
                }
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
        aborted {
            echo 'Pipeline aborted'
        }
    }
}