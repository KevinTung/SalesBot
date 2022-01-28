"use strict"; //what's this?
var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin"; // For testing only. Don't store credentials in code.
// Create a client with SSL/TLS enabled.
import { Client } from "@opensearch-project/opensearch";
var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    rejectUnauthorized: false//) if you're using self-signed certificates with a hostname mismatch.
  },
});
var index_metric = "juzibot-sales-metric";
var doc_metric_id = 4;
print_all_rooms()

async function print_all_rooms(){
  var value = await client.get({
    id: doc_metric_id,
    index: index_metric
  })
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var data = value.body._source.data; 
  for(var i in data){
    console.log("."+i)
    for(var room in data[i]["all_rooms"]){
      console.log(".. "+room);     
    }
  }
}