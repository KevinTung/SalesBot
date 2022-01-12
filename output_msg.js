

"use strict"; //what's this?
var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin"; // For testing only. Don't store credentials in code.
var ca_certs_path = "./root-ca.pem";
// Create a client with SSL/TLS enabled.
import { Client } from "@opensearch-project/opensearch";
import { POINT_CONVERSION_HYBRID } from "constants";
import fs from "fs";
import { get } from "http";
import csvwriter from 'csv-writer'
const createCsvWriter = csvwriter.createObjectCsvWriter;

var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    rejectUnauthorized: false//) if you're using self-signed certificates with a hostname mismatch.
  },
});

var index_name = "juzibot-sales-msg-v2-4";
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
var index_metric = "juzibot-sales-metric";
var all_sales = [
  // ,'曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超'
  '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强'
]
const dividers = ["------","- - - - - - - - - - - - - - -"]
var doc_metric_id = 4;
var juzi_corp_name = "北京句子互动科技有限公司"

myfunc()
async function myfunc(){
    var value = await client.get({
      id: doc_metric_id,
      index: index_metric
    })
    //put_document(index_metric,value.body._source,doc_metric_id);
    //console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
    var data = value.body._source.data; 
    var total_detail_data = []
    for(var i in data){
        //console.log(JSON.stringify(i,null,4));
        if(i==='童子铨')continue; //this is developer 
        for(var room in data[i]["all_rooms"]){
            console.log("\nname: "+i+" room: "+room);     
            var qq = {
            sort:[
                {"payload.timestamp":{"order":"asc"}}
            ],
            size:1000,
            query: {
                bool:{
                must:[
                    {match: {
                    "payload.roomInfo.topic.keyword":room
                    }},
                    {range:{
                    "payload.timestamp": {
                        gte: "now-120d/d",
                        lt: "now/s"
                    }
                    }}
                ]
                }
            }
            }
            var response = await query_document(index_name,qq);
            //OUTPUT DETAIL
            var room_output_data =  Array.from(output_room(response));
            total_detail_data = total_detail_data.concat(room_output_data)
        }   
      
    }
    //quit double loop 
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    var date_string = new Date(Date.now()).toLocaleDateString("en-US", options);
    const sales_output_head = "all_output/"
    var detail_name = "msg_detail_"+date_string+'.csv'
    all_msg_detail_output(sales_output_head+detail_name,total_detail_data) //path: path: sales_output_head+timerange+'_room_detail.csv',
  }



  function output_room(response){
    const time_threshold_min = 2;
    if(response.length===0){
      return false
    }
    var room_output_data = [];
    for(var k=0; k<response.length;k++){
      var obj = response[k]._source.payload; 
      var d = new Date(obj.timestamp)
      var s = d.toLocaleTimeString()
      var ss = d.toLocaleDateString()
      var name = obj.fromInfo.payload.name; 
      var room = obj.roomInfo.topic; 
      room = room.replace("句子互动服务群-",''); 
      if(room === "句子"){
        break;
      }
      if(is_from_customer(response[k])){
        room_output_data.push({
              name:"",
              room:room,
              customer_name:name,
              msg_text:beautify_msg(obj.text),
              date:ss,
              time:s,
              tag:"顾客消息",
              msg_id:obj.id,
            });
      }else{
        room_output_data.push({
            name:name,
            room:room,
            customer_name:"",
            msg_text:beautify_msg(obj.text),
            date:ss,
            time:s,
            tag:"销售回复", 
            msg_id:obj.id,
        })
      }
    }
    return room_output_data
  }

  function beautify_msg(text){
    return beautify(text)
}
function beautify(text){
 var a = text.split(dividers[0])
 var b = []
 for(var i=0; i<a.length; i++){
   var c = a[i].split(dividers[1])
   b = b.concat(c)
 }
 var d = b[b.length-1].split("\n")
 return d[d.length-1]
}
function all_msg_detail_output(path,data){
    const csvWriter = createCsvWriter({
      path: path,
      header: [
        {id: 'name', title: '销售名'},
        {id: 'room', title: '群聊名'},
        {id: 'customer_name', title: '顾客名'},
        {id: 'msg_text', title: '消息内容'},
        {id: 'date', title: '回复日期'},
        {id: 'time', title: '回复日期点'},
        {id: 'tag', title: '类别'},
        {id: 'msg_id', title: '消息 ID'},
      ]
    });
    csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));
}


function is_from_customer(msg){
    //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
    //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
    return !all_sales.includes(msg._source.payload.fromInfo.payload.name) && //not sales
    (msg._source.payload.fromInfo.payload.corporation!==juzi_corp_name) //not employee
}