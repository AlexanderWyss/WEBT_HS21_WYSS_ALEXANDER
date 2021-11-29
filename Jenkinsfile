node {
    stage('Clone repository') {
        checkout scm
    }
    stage('Build image') {
        dockerImage = docker.build("alexanderwyss/WEBT")
    }
    stage('Deploy') {
        sh 'docker stop WEBT || true && docker rm -f WEBT || true'
        sh 'docker run -d --expose 8080 --restart unless-stopped --name WEBT -e VIRTUAL_HOST=webt.wyss.tech -e VIRTUAL_PORT=8080 -e LETSENCRYPT_HOST=webt.wyss.tech alexanderwyss/WEBT:latest'
    }
}