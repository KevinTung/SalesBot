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
var index_name = "juzibot-sales-msg-v2-4";
var juzi_corp_name = "北京句子互动科技有限公司"
//SECTION:TIMER
//for each 
//new method: pull every rooms, from end, check the last customer msg, cmp time difference 

var all_sales = [
    // ,'曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超'
    '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强','undefined'//show which room is undefined 
  ]

check_timeout()
async function check_timeout(){
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
      var data = value.body._source.data; 

      for(var i in data){
        //console.log(JSON.stringify(i,null,4));
        if(i==='童子铨')continue; //testing 
        if(!all_sales.includes(i))continue;

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
                        gte: "now/d",
                        lt: "now/s"
                        }
                    }}
                    ]
                }
                }
            }
           
            var response = await query_document(index_name,qq);
            for(var k in response){
                var obj = response[k]._source.payload; 
                var d = new Date(obj.timestamp)
                var s = d.toLocaleTimeString()
                var ss = d.toLocaleDateString()
                
                console.log(".."+beautify(
                ss+" "+s+" "+obj.roomInfo.topic+" "+
                obj.fromInfo.payload.name+
                ":"+
                obj.text + " "
                ));
                
            }
            for(var k=response.length-1; k>=0;k--){
                if(!is_from_customer(response[k]) && k==response.length-1){
                    console.log("**Last replier is sales or employee! GOOD!")
                    break;
                }
                else if(!is_from_customer(response[k])){ 
                    var obj = response[k+1]._source.payload; 
                    var d = new Date(obj.timestamp)
                    var now = new Date()
                    var s = d.toLocaleTimeString()
                    var ss = d.toLocaleDateString()
                    var not_replied_time = ((now-d)/1000/60).toFixed(2)  //this - is ok? 
                    console.log("**NOT REPLIED TIME:", not_replied_time)

                    //switch cases: if in 10,20,...alert, else not alert 
                //    if(not_replied_time > time_threshold_min * 60 * 1000){
                //         crit_2_mins_count+=1; 
                //     }    
                    break;            
                }
            }


        }
    }
}

//update the metric to be without timerID 

async function query_document(index_name,query){
    // Search for the document
    var response = await client.search({
        index: index_name,
        body: query,
    });
    console.log("Search results:");
    console.log(response.body.hits.hits.length);
    return response.body.hits.hits;
}
function is_from_customer(msg){
    //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
    //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
    return !all_sales.includes(msg._source.payload.fromInfo.payload.name) && //not sales
    (msg._source.payload.fromInfo.payload.corporation!==juzi_corp_name) //not employee
}
const dividers = ["------","- - - - - - - - - - - - - - -"]
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
var green_card =  {
    "config": {
      "wide_screen_mode": true
    },
    "elements": [
      {
        "tag": "markdown",
        "content": ""
      }
    ],
    "header": {
      "template": "green",
      "title": {
        "content": "",
        "tag": "plain_text"
      }
    }
  }
var yellow_card =  {
    "config": {
      "wide_screen_mode": true
    },
    "elements": [
      {
        "tag": "markdown",
        "content": ""
      }
    ],
    "header": {
      "template": "yellow",
      "title": {
        "content": "超时提醒⏰",
        "tag": "plain_text"
      }
    }
  }
var orange_card =  {
    "config": {
      "wide_screen_mode": true
    },
    "elements": [
      {
        "tag": "markdown",
        "content": ""
      }
    ],
    "header": {
      "template": "orange",
      "title": {
        "content": "超时提醒⏰",
        "tag": "plain_text"
      }
    }
  }
var red_card =  {
    "config": {
        "wide_screen_mode": true
    },
    "elements": [
        {
        "tag": "markdown",
        "content": ""
        }
    ],
    "header": {
        "template": "red",
        "title": {
        "content": "超时提醒⏰",
        "tag": "plain_text"
        }
    }
}