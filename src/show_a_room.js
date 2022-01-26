

"use strict"; //what's this?
var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin"; // For testing only. Don't store credentials in code.

// Optional client certificates if you don't want to use HTTP basic authentication.
// var client_cert_path = '/full/path/to/client.pem'
// var client_key_path = '/full/path/to/client-key.pem'

// Create a client with SSL/TLS enabled.
import { Client } from "@opensearch-project/opensearch";
//import { payload } from "wechaty-puppet";


import csvwriter from 'csv-writer'
const createCsvWriter = csvwriter.createObjectCsvWriter;

var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    //ca: fs.readFileSync(ca_certs_path),
    rejectUnauthorized: false//) if you're using self-signed certificates with a hostname mismatch.
    // cert: fs.readFileSync(client_cert_path),
    // key: fs.readFileSync(client_key_path)
  },
});
var roomname = "句子互动服务群-麻雀小样"
var index_name = "juzibot-sales-msg-v2-4";
var index_metric = "juzibot-sales-metric";
const dividers = ["------","- - - - - - - - - - - - - - -"]

var qq = {
    sort:[
      {"payload.timestamp":{"order":"asc"}}
    ],
    size:1000,
    query: {
      bool:{
        must:[
          {match: {
            "payload.roomInfo.topic.keyword":roomname
          }},
          {range:{
            "payload.timestamp": {
              gte: "now-100d/s",
              lt: "now/s"
            }
          }}
        ]
      }
    }
  }
  async function query_document(index_name,query){
    // Search for the document.
    
    var response = await client.search({
      index: index_name,
      body: query,
    });
    console.log("Search results:");
    console.log(response.body.hits.hits.length);
    return response.body.hits.hits;
  }
  var response = await query_document(index_name,qq);

  for(var k in response){
    var obj = response[k]._source.payload; 
    var d = new Date(obj.timestamp)
    var s = d.toLocaleTimeString()
    var ss = d.toLocaleDateString()
    var name = obj.fromInfo.payload.name; 
    var room = obj.roomInfo.topic; 
    console.log(s,ss,name,room,beautify_msg(obj.text) )
  }


function beautify_msg(text){
    return beautify(text)
}
function beautify(text){
 var a = text.split(dividers[0])
 var b = []
 //console.log(a,a.length)
 for(var i=0; i<a.length; i++){
   //console.log(i,a[i])
   var c = a[i].split(dividers[1])
   //console.log("splt:",c)
   b = b.concat(c)
 }
 var d = b[b.length-1].split("\n")
// console.log(d,"returning:",d[d.length-1]) 
 return d[d.length-1]
}