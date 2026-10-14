pipeline {
    // Agent configuration: 'any' runs on any available Jenkins agent (Linux, macOS, or Windows).
    // If your Jenkins uses Docker, you can use:
    // agent { docker { image 'node:20-alpine' args '-u root' } }
    agent any

    // OPTIONAL: If using the Jenkins NodeJS Plugin (Manage Jenkins -> Global Tool Configuration -> NodeJS),
    // uncomment the tools block below and match your configured tool name:
    /*
    tools {
        nodejs 'NodeJS-20'
    }
    */

    options {
        // Keep the 15 most recent builds and 5 build artifact bundles
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        // Terminate build if it exceeds 15 minutes
        timeout(time: 15, unit: 'MINUTES')
        // Prefix console logs with timestamps
        timestamps()
        // Prevent simultaneous builds of the same branch
        disableConcurrentBuilds()
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Checking Out Source Code ==='
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                echo '=== Verifying Node.js and NPM Environment ==='
                script {
                    if (isUnix()) {
                        sh 'node -v'
                        sh 'npm -v'
                    } else {
                        bat 'node -v'
                        bat 'npm -v'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Installing Dependencies ==='
                script {
                    if (isUnix()) {
                        // Use npm ci for clean, deterministic installations; fallback to npm install if needed
                        sh 'npm ci || npm install'
                    } else {
                        bat 'npm ci || npm install'
                    }
                }
            }
        }

        stage('Lint & Code Quality') {
            steps {
                echo '=== Running Linter (Oxlint) ==='
                script {
                    if (isUnix()) {
                        sh 'npm run lint'
                    } else {
                        bat 'npm run lint'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo '=== Running Test Suite ==='
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }

        stage('Build Production Bundle') {
            steps {
                echo '=== Building Vite Production Bundle ==='
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Validate Build Output') {
            steps {
                echo '=== Validating Production Output Integrity ==='
                script {
                    if (isUnix()) {
                        sh '''
                            if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
                                echo "ERROR: dist/index.html not found! Build failed to produce expected assets."
                                exit 1
                            fi
                            echo "SUCCESS: Production build output verified in dist/ directory."
                        '''
                    } else {
                        bat '''
                            @echo off
                            if not exist "dist\\index.html" (
                                echo ERROR: dist\\index.html not found! Build failed to produce expected assets.
                                exit /b 1
                            )
                            echo SUCCESS: Production build output verified in dist\\ directory.
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '============================================'
            echo '  BUILD & VALIDATION SUCCEEDED! 🎉          '
            echo '============================================'
            // Archive the compiled build assets as artifacts available for download in Jenkins
            archiveArtifacts artifacts: 'dist/**', fingerprint: true, allowEmptyArchive: false
        }
        failure {
            echo '============================================'
            echo '  BUILD PIPELINE FAILED! ❌                 '
            echo '  Check the console output above for logs.  '
            echo '============================================'
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
