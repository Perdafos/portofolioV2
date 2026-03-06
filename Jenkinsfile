pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(name: 'DEPLOY_ENABLED', defaultValue: false, description: 'Deploy hasil build ke server')
    string(name: 'DEPLOY_HOST', defaultValue: 'your.server.com', description: 'Hostname/IP server tujuan')
    string(name: 'DEPLOY_PORT', defaultValue: '22', description: 'Port SSH server tujuan')
    string(name: 'DEPLOY_TARGET_DIR', defaultValue: '/var/www/portfolio', description: 'Folder tujuan di server')
    string(name: 'SSH_CREDENTIALS_ID', defaultValue: 'portfolio-prod-ssh', description: 'Credentials ID (SSH Username with private key) di Jenkins')
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }

    stage('Archive Artifact') {
      steps {
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Deploy') {
      when {
        allOf {
          expression { return params.DEPLOY_ENABLED }
          anyOf {
            branch 'main'
            branch 'master'
          }
        }
      }
      steps {
        script {
          if (!params.SSH_CREDENTIALS_ID?.trim()) {
            error('SSH_CREDENTIALS_ID wajib diisi saat DEPLOY_ENABLED=true')
          }

          sshagent(credentials: [params.SSH_CREDENTIALS_ID]) {
            if (isUnix()) {
              sh "chmod +x scripts/deploy.sh"
              sh "./scripts/deploy.sh '${params.DEPLOY_HOST}' '${params.DEPLOY_PORT}' '${params.DEPLOY_TARGET_DIR}'"
            } else {
              powershell "./scripts/deploy.ps1 -HostName '${params.DEPLOY_HOST}' -Port '${params.DEPLOY_PORT}' -TargetDir '${params.DEPLOY_TARGET_DIR}'"
            }
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}