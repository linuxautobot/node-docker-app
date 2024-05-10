Created custom node js application with custom metrics 

Git Repo : https://github.com/linuxautobot/node-docker-app 

Installing Package 


npm init -y

Below is a structured documentation for a Node.js application that includes two routes: / for a simple "Hello World!" response and /metrics for exposing Prometheus-compatible metrics.
A custom metric called http_express_req_res_time using a Histogram.
name: "http_express_req_res_time": This is the name of your metric.
labelNames: ["method", "route", "status_code"]**: These are labels or dimensions associated with this metric. 
buckets: [1,50,100,200,500,600,700,800,900,1000,2000]**: These are the buckets defining the ranges for the histogram. Each bucket represents a time range (in milliseconds, presumably) that the response time falls into.
- name: 'total_req'**: This is the name of your counter metric.
- help: 'Tells total number of request': This describes what the counter is measuring — in this case, the total number of requests.


docker run -p 9000:9000 --name my-node-app node-docker-app

~/l/H/node-docker-app ❯ curl -i  http://localhost:9000/   
HTTP/1.1 200 OK
Content-Type: text/plain
Date: Thu, 09 May 2024 15:05:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 13

Hello World!





Created two namespaces in Kubernetes cluster;
one for custom application and one for monitoring applications (Prometheus, Grafana and mysql exporter)
Create Namespace for Custom Application: 
kubectl create namespace custom-app
kubectl create namespace monitoring
kubectl get namespaces


NAME              STATUS   AGE
custom-app        Active   8s
default           Active   16d
kube-node-lease   Active   16d
kube-public       Active   16d
kube-system       Active   16d
monitoring        Active   8s




Dir File structure: 
1. Dockerfile
Contains instructions to build a Docker image for your Node.js application.

2. package.json & package-lock.json
Define Node.js dependencies and metadata for your application.

3. app.js & db.js
 Application code files.

 4. Kubernetes Configuration Files:
   - db-pvc.yaml: Defines Persistent Volume Claim (PVC) for MySQL data.  
   - db-pv.yaml: Describes Persistent Volume (PV) for MySQL storage.
   - db-deployment.yaml: Kubernetes Deployment for MySQL database.
   - db-svc.yaml: Service definition for MySQL database (ClusterIP).
   - svc-custom-app.yaml: Service definition for your custom application (ClusterIP).
Note : Data is stored on node and svc is cluster ip 


  5. Monitoring Configuration:
   - prometheus.yaml: Prometheus deployment configuration.
   - grafana.yaml: Grafana deployment configuration for visualization.

  6. Other Files:
   - deploy-custom-app.yaml: Deployment configuration for your custom Node.js application.
   - node_modules/: Directory containing Node.js dependencies.
  
  Deployment Steps:
1. Docker Image Creation:
   - Build your Node.js application into a Docker image using `Dockerfile`.
   - Push the Docker image to Docker Hub.

2. Kubernetes Deployment:
   - Apply `db-pv.yaml` and `db-pvc.yaml` to set up storage for MySQL.
   - Deploy MySQL using `db-deployment.yaml` and expose it internally via `db-svc.yaml`.
   - Deploy your Node.js application using `deploy-custom-app.yaml` in the `custom-app` namespace.

3. Service Access:
   - Access services internally within the cluster using ClusterIP.
   - For local access:
     - Use port forwarding to access services locally:
   
   
       kubectl port-forward service/<your-service-name> <local-port>:<service-port> -n custom-app
     

     - Example: `kubectl port-forward service/my-app-service 8080:80 -n custom-app` to access `my-app-service` locally on port `8080`.

4. Monitoring Setup:
   - Deploy Prometheus using `prometheus.yaml`.
   - Deploy Grafana for visualization using `grafana.yaml`.


Files
- app.js: Main application file containing the HTTP server setup and metric handling.
- package.json: Node.js package configuration specifying dependencies.
- Dockerfile: Defines Docker image setup for the Node.js application.

  Dependencies
- express: Node.js web framework for routing.
- prom-client: Prometheus client library for custom metrics.

  Prerequisites
- Node.js and npm installed locally.
- Docker for containerization (optional).

1. Install dependencies:

   npm install
Running the Application
- Locally: node app.js
  Note: Application will run on `http://localhost:9000`.


  Application Details
 # Routes
- `GET /`:
  - Returns "Hello World!".

 # Prometheus Metrics
- Custom metrics are registered using `prom-client` library.
- Metrics include:
  - http_requests_total: Counts total HTTP requests.

 # MySQL Database Integration
- Metrics data is periodically updated and stored in MySQL database named "production".
- Database connection details are configured in the application.

  Prometheus Integration
1. Configure Prometheus to scrape metrics from the application:

    scrape_configs:
    - job_name: 'node-custom-app'
      static_configs:
        - targets: ["10.98.232.133:8080"]
    - job_name: 'mysql'
      static_configs:
        - targets: ["10.111.92.227:9104"] 



  MySQL Database Setup
- Ensure MySQL server is running.
- Create a database named "production" if not already existing.
- Configure database connection details in `app.js`.

  Metrics Endpoint
- Metrics are exposed at `/metrics` endpoint for Prometheus scraping.

  Example Usage
1. Access application:

   curl http://localhost:9000/


2. View metrics:
 
  $ curl http://localhost:9000/metrics




I deployed a MySQL server that stores metrics for my Node.js application.

I created a user named `node-user`, which is utilized by both the Node.js application and Grafana.




CREATE USER 'node-user'@'%' IDENTIFIED BY 'welcome';

GRANT ALL PRIVILEGES ON *.* TO 'node-user'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;


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
  kubectl --namespace monitoring port-forward $POD_NAME 9104



Both target endpoints have been added to Prometheus: one for Node.js metrics and the other for the MySQL exporter. These endpoints are configured to be scraped every 5 seconds.

Integrate Custom Metrics into a Node.js Application Using prom-client

Utilise Custom and Predefined Dashboards from the Official Website to Monitor Latency, Request Count, and Other Metrics

The dashboard displays detailed information about memory usage, including total heap memory, used heap memory, process memory, and external memory. It also includes custom metrics showing the number of requests made. 


<img width="1440" alt="image" src="https://github.com/linuxautobot/node-docker-app/assets/13101462/be9434d7-9ee4-4250-96c7-d1989af1323c">

<img width="721" alt="image" src="https://github.com/linuxautobot/node-docker-app/assets/13101462/68b48636-22ac-4c27-8ce8-4f1eba496681">

<img width="722" alt="image" src="https://github.com/linuxautobot/node-docker-app/assets/13101462/af6970a4-5868-4cad-9b0c-de24ab3e7a99">

[Documentation](https://docs.google.com/document/d/e/2PACX-1vSIXVNGAU2p5u_hmtZNgMK0J12JspYbyr83Mbyp0vXo8WchqimENvAJ7y0QJ_HfsytmcbXn42M4gBZx/pub)


Deploying the Entire Infrastructure on a standalone Kubernetes Cluster on local: Adding Deployment Files and Creating Resources for the Cluster.

Ref used : https://grafana.com/grafana/dashboards/11159-nodejs-application-dashboard/ 
