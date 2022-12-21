{{/*
Expand the name of the chart.
*/}}
{{- define "flomesh-console.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "flomesh-console.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "flomesh-console.labels" -}}
helm.sh/chart: {{ include "flomesh-console.chart" . }}
{{ include "flomesh-console.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "flomesh-console.selectorLabels" -}}
app.kubernetes.io/name: {{ include "flomesh-console.name" . }}
{{- end }}

{{- define "flomesh-console.repository" -}}
{{- if contains "ubi" .Chart.AppVersion -}}
quay.io/{{ .Values.image.repository }}
{{- else -}}
{{ .Values.image.repository }}
{{- end -}}
{{- end }}

{{- define "flomesh-console.imageName" -}}
{{- if contains "ubi" .Chart.AppVersion -}}
{{ include "flomesh-console.repository" .}}/{{.Values.gui.imageName}}-ubi8
{{- else -}}
{{ include "flomesh-console.repository" .}}/{{.Values.gui.imageName}}
{{- end -}}
{{- end }}

{{- define "flomesh-console.tag" -}}
{{- if .Values.gui.tag  -}}
{{ .Values.gui.tag }}
{{- else -}}
{{ .Chart.AppVersion }}
{{- end -}}
{{- end }}

{{- define "pipyRepo.imageName" -}}
{{- if contains "ubi" .Chart.AppVersion -}}
{{ include "flomesh-console.repository" .}}/{{.Values.pipyRepo.imageName}}-ubi8
{{- else -}}
{{ include "flomesh-console.repository" .}}/{{.Values.pipyRepo.imageName}}
{{- end -}}
{{- end }}

{{- define "curl.imageName" -}}
{{- if contains "ubi" .Chart.AppVersion -}}
{{ include "flomesh-console.repository" .}}/curl-ubi8
{{- else -}}
{{ include "flomesh-console.repository" .}}/curl
{{- end -}}
{{- end }}
