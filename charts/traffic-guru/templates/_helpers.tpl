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
