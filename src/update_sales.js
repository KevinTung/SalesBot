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
var all_sales = [
    '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强','孙文博','undefined'
]

update_sales()

async function update_sales(){
  var value = await client.get({
    id: doc_metric_id,
    index: index_metric
  })
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  
  var data = value.body._source.data; 
  var new_data = {}

  for(var i in data){
    //console.log("."+i, data[i]["all_rooms"])
   
    for(var room in data[i]["all_rooms"]){
        counter += 1
    //   console.log(".. "+ JSON.stringify(data[i]["all_rooms"][room],null,4));     
       new_data[room] = clone(data[i]["all_rooms"][room])
       delete new_data[room]["timerID"]
       delete new_data[room]["finished_update"]
       delete new_data[room]["timer_timestamp"]
       delete new_data[room]["timerAlive"]
       delete new_data[room]["customers"]
       new_data[room]["phase"] = "pre-sales"
      
       var res = []
       
       if(!Object.keys(new_data[room]).includes("employee")){
           print(new_data[room])
           error+=1 
           
       }else{
        for(var j of Object.keys(new_data[room]["employee"])){
            if(all_sales.includes(j)){
                res.push(j)
            }
        }
        }   
       if(res.length == 0){
        console.log(res.length,new_data[room])
        zeros +=1 
        error_rooms[room] = new_data[room]
       }else if(res.length > 1){
           aboveone +=1 
        console.log(res.length,new_data[room])
        error_rooms[room] = new_data[room]
       }else{
        exactone += 1
        new_data[room]["in_charge"] = res[0]        
       }
       new_data[room]["sales"] = res
    }
  }
  console.log(counter, zeros, exactone, aboveone)
  console.log("error",error)
  console.log(new_data)
  console.log("ERROR ROOMS:",error_rooms)
}


//AFTER update sales

function clone(a) {
    return JSON.parse(JSON.stringify(a));
 }
 function print(a){
     console.log(a)
 }