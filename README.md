helm install prometheus-mysql-exporter prometheus-community/prometheus-mysql-exporter -n monitoring \                              ⎈ docker-desktop 05:08:34 PM
  --set mysql.host=10.101.43.1 \
  --set mysql.user=node-user \
  --set mysql.password=welcome

NAME: prometheus-mysql-exporter
LAST DEPLOYED: Fri May 10 17:08:49 2024
NAMESPACE: monitoring
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace monitoring -l "app.kubernetes.io/name=prometheus-mysql-exporter,app.kubernetes.io/instance=prometheus-mysql-exporter" -o jsonpath="{.items[0].metadata.name}")
  echo "Visit http://127.0.0.1:9104 to use your application"
  kubectl --namespace monitoring port-forward $POD_NAME 9104aa