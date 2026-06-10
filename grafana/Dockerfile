FROM grafana/grafana:latest

## Todo Cho Container Grafana doc tu file yml tren host
## Todo Khai bao endpoint metrics Prometheus thu thap duoc tu cac service => /etc/grafana/provisioning/datasource
COPY ./datasource-prometheus.yaml ${GF_PATHS_PROVISIONING}/datasources/
## Todo Khai bao Dashboard UI cho so lieu Prometheus => /etc/grafana/provisioning/dashboard
COPY ./dashboard-provider.yaml ${GF_PATHS_PROVISIONING}/dashboards/
## Todo Chep UI metrics Prometheus vao dashbosrds => /var/lib/grafana/dashboards/
COPY ./dabble_dashboard_prometheus.json /var/lib/grafana/dashboards/

#COPY ./datasource-business.yaml ${GF_PATHS_PROVISIONING}/datasources/
#COPY ./dabble_dashboard_business.json /var/lib/grafana/dashboards/
