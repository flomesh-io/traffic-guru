{{/*
Create a default fully qualified dependency name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
Usage:
{{ include "common.names.dependency.fullname" (dict "chartName" "dependency-chart-name" "chartValues" .Values.dependency-chart "context" $) }}
*/}}
{{- define "common.names.dependency.fullname" -}}
{{- if .chartValues.fullnameOverride -}}
{{- .chartValues.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .chartName .chartValues.nameOverride -}}
{{- if contains $name .context.Release.Name -}}
{{- .context.Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .context.Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "traffic-guru.mariadb.fullname" -}}
{{- include "common.names.dependency.fullname" (dict "chartName" "mariadb" "chartValues" .Values.mariadb "context" $) -}}
{{- end -}}

{{- define "traffic-guru.prometheus.fullname" -}}
{{- include "common.names.dependency.fullname" (dict "chartName" "prometheus" "chartValues" .Values.prometheus "context" $) -}}
{{- end -}}

{{/*
Return the MariaDB Hostname
*/}}
{{- define "traffic-guru.databaseHost" -}}
{{- if .Values.mariadb.enabled }}
    {{- if eq .Values.mariadb.architecture "replication" }}
        {{- printf "%s-primary" (include "traffic-guru.mariadb.fullname" .) | trunc 63 | trimSuffix "-" -}}
    {{- else -}}
        {{- printf "%s" (include "traffic-guru.mariadb.fullname" .) -}}
    {{- end -}}
{{- else -}}
    {{- printf "%s" .Values.externalDatabase.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB Port
*/}}
{{- define "traffic-guru.databasePort" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "3306" -}}
{{- else -}}
    {{- printf "%d" (.Values.externalDatabase.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB Database Name
*/}}
{{- define "traffic-guru.databaseName" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "%s" .Values.mariadb.auth.database -}}
{{- else -}}
    {{- printf "%s" .Values.externalDatabase.database -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB User
*/}}
{{- define "traffic-guru.databaseUser" -}}
{{- if .Values.mariadb.enabled }}
    {{- printf "%s" .Values.mariadb.auth.username -}}
{{- else -}}
    {{- printf "%s" .Values.externalDatabase.user -}}
{{- end -}}
{{- end -}}

{{/*
Return the MariaDB Secret Name
*/}}
{{- define "traffic-guru.databasePassword" -}}
{{- if .Values.mariadb.enabled }}
    {{- if .Values.mariadb.auth.password -}}
        {{- printf "%s" .Values.mariadb.auth.password -}}
    {{- else -}}
        {{- printf "%s" (include "traffic-guru.mariadb.fullname" .) -}}
    {{- end -}}
{{- else if .Values.externalDatabase.password -}}
    {{- printf "%s" .Values.externalDatabase.password -}}
{{- else -}}
    {{- printf "%s-externaldb" (include "traffic-guru.mariadb.fullname" .) -}}
{{- end -}}
{{- end -}}

{{/*
Return the Prometheus Hostname
*/}}
{{- define "traffic-guru.prometheusHost" -}}
{{- if .Values.prometheus.enabled }}
    {{- printf "http://%s:%d" (include "traffic-guru.prometheus.fullname" .) (.Values.externalPrometheus.port | int ) -}}
{{- else -}}
    {{- printf "%s:%d" .Values.externalPrometheus.host (.Values.externalPrometheus.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Expand the name of the chart.
*/}}
{{- define "traffic-guru.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "traffic-guru.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "traffic-guru.labels" -}}
helm.sh/chart: {{ include "traffic-guru.chart" . }}
{{ include "traffic-guru.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "traffic-guru.selectorLabels" -}}
app.kubernetes.io/name: {{ include "traffic-guru.name" . }}
{{- end }}

{{- define "traffic-guru.prometheus.labels"}}
helm.sh/chart: {{ include "traffic-guru.chart" . }}
app.kubernetes.io/name: prometheus
app.kubernetes.io/component: prometheus
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "traffic-guru.pipyRepo.labels"}}
helm.sh/chart: {{ include "traffic-guru.chart" . }}
app.kubernetes.io/name: pipy-repo
app.kubernetes.io/component: pipy-repo
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "traffic-guru.repository" -}}
{{- if contains "ubi" .Chart.Version -}}
quay.io/{{ .Values.image.repository }}
{{- else -}}
{{ .Values.image.repository }}
{{- end -}}
{{- end }}

{{- define "traffic-guru.imageName" -}}
{{- if contains "ubi" .Chart.Version -}}
{{ include "traffic-guru.repository" .}}/{{.Values.gui.imageName}}-ubi8
{{- else -}}
{{ include "traffic-guru.repository" .}}/{{.Values.gui.imageName}}
{{- end -}}
{{- end }}

{{- define "traffic-guru.tag" -}}
{{- if .Values.gui.tag  -}}
{{ .Values.gui.tag }}
{{- else -}}
{{ .Chart.AppVersion }}
{{- end -}}
{{- end }}

{{- define "pipyRepo.imageName" -}}
{{- if contains "ubi" .Chart.Version -}}
{{ include "traffic-guru.repository" .}}/{{.Values.pipyRepo.imageName}}-ubi8
{{- else -}}
{{ include "traffic-guru.repository" .}}/{{.Values.pipyRepo.imageName}}
{{- end -}}
{{- end }}

{{- define "curl.imageName" -}}
{{- if contains "ubi" .Chart.Version -}}
{{ include "traffic-guru.repository" .}}/curl-ubi8
{{- else -}}
{{ include "traffic-guru.repository" .}}/curl
{{- end -}}
{{- end }}

{{/* Security context values that ensure restricted access to host resources */}}
{{- define "restricted.securityContext" -}}
securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    supplementalGroups: [5555]
{{- end -}}
