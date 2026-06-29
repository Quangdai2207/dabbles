pipeline {
	args any

	stages {
		stage('Verify') {
			steps {
				dir('dabble-project') {
					sh 'chmod +x ./ci/00-verify.sh'
					sh './ci/00-verify.sh'
				}
			}
		}
		stage('Build') {
			steps {
				dir('dabble-project') {
					sh 'chmod +x ./ci/01-build.sh'
					sh './ci/01-build.sh'
				}
			}
		}
		stage('Test') {
			steps {
				dir('dabble-project') {
					sh 'chmod +x ./ci/02-test.sh'
					sh './ci/02-test.sh'
				}
			}
		}
		stage('Push') {
			steps {
				dir('dabble-project') {
					sh 'chmod +x ./ci/03-push.sh'
					sh './ci/03-push.sh'
					echo "push is done!"
				}
			}
		}
	}
}