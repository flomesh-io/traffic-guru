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
