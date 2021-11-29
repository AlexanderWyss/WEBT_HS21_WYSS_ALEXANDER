node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Build image') {
        dockerImage = docker.build("alexanderwyss/webt")
    }
    stage('Deploy') {
        sh 'docker stop webt || true && docker rm -f webt || true'
        sh 'docker run -d --expose 80 --restart unless-stopped --name webt -e VIRTUAL_HOST=webt.wyss.tech -e VIRTUAL_PORT=80 -e LETSENCRYPT_HOST=webt.wyss.tech alexanderwyss/webt:latest'
    }
}