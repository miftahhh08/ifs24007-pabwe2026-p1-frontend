// Pipeline Jenkins untuk repo FRONTEND GulaSadar: install -> test -> build -> (opsional) deploy.
pipeline {
  agent any
  options { timestamps(); timeout(time: 20, unit: 'MINUTES') }
  environment {
    PATH = "${env.HOME}/.bun/bin:${env.PATH}"
    // Alamat backend yang dipakai saat build. Atur di Jenkins (Environment variables) untuk deployment online.
    NEXT_PUBLIC_GULASADAR_BASEURL = "${env.NEXT_PUBLIC_GULASADAR_BASEURL ?: 'http://127.0.0.1:4000'}"
  }
  stages {
    stage('Install Bun') {
      steps { sh 'command -v bun || curl -fsSL https://bun.sh/install | bash; bun --version' }
    }
    stage('Install dependencies') {
      steps { sh 'bun install --frozen-lockfile' }
    }
    stage('Lint') {
      steps { sh 'bun run lint' }
    }
    stage('Test') {
      steps { sh 'bun run test' }
    }
    stage('Build') {
      steps { sh 'bun run build' }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps { echo 'Deploy: docker compose up -d --build (lihat README).' }
    }
  }
  post {
    always { archiveArtifacts artifacts: 'coverage/lcov.info', allowEmptyArchive: true }
    success { echo 'Pipeline frontend sukses' }
    failure { echo 'Pipeline frontend gagal, periksa log tahap yang merah' }
  }
}
