HELM_PACKAGE ?= traffic-guru
TAG ?= 0.0.7-1
HELM_REPO_OWNER ?= flomesh-io
CHART_VERSION ?= $(shell echo ${TAG} | cut -f1 -d '-')

clean-helm-repo:
	rm -rf helm-repo || true

package-chart:
	helm repo add bitmani https://charts.bitnami.com/bitnami
	helm repo update
	helm dependency build ${HELM_PACKAGE}
	helm package --version ${CHART_VERSION} --app-version ${TAG} ${HELM_PACKAGE} 

release-chart: clean-helm-repo package-chart
	git clone --branch gh-pages https://github:${GITHUB_API_TOKEN}@github.com/${HELM_REPO_OWNER}/helm-charts.git helm-repo
	mv ${HELM_PACKAGE}*.tgz helm-repo
	cd helm-repo; helm repo index .

	if [ ${GITHUB_ACTIONS} ]; then cd helm-repo && git config user.name "github-actions[bot]"; fi
	if [ ${GITHUB_ACTIONS} ]; then cd helm-repo && git config user.email "github-actions[bot]@users.noreply.github.com"; fi

	cd helm-repo; git add . && git commit --message "add ${HELM_PACKAGE}-${CHART_VERSION}" && git push origin HEAD:gh-pages || exit 1
	rm -rf helm-repo || true
