const http = require('http');
const express = require('express');
const client = require('prom-client');
const responeTime = require('response-time');
const db = require('./db');

const hostname = '0.0.0.0';
const port = process.env.PORT || 9000;


const app = express();


client.collectDefaultMetrics({ register: client.register });


const reqResTime = new client.Histogram(
    {
      name: "http_express_req_res_time",
      help: "This tells how much time is taken by request and respone",
      labelNames: ["method", "route", "status_code" ],
      buckets: [1,50,100,200,500,600,700,800,900,1000,2000]
    });

const totalRequestCounter = new client.Counter({
   name: 'total_req',
   help: 'Tells total number of request'
});

app.use(responeTime((req, res, time) => {
  totalRequestCounter.inc(); 
  reqResTime
   .labels({
      method: req.method,
      route: req.url,
      status_code: res.statusCode,
   }).observe(time);
})) ; 

app.get('/', (req, res) => {
  totalRequestCounter.inc();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});


app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  
  
  try {
    // Insert metrics data into MySQL database
    const [rows, fields] = await db.execute('INSERT INTO metrics_data (timestamp, metrics) VALUES (?, ?)', [new Date(), metrics]);
    console.log('Metrics data saved to MySQL database.');
  } catch (error) {
    console.error('Error saving metrics data to MySQL:', error);
    res.status(500).send('Internal Server Error');
    return;
  }

  res.send(metrics);


});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
