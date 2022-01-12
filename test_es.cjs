"use strict"; //what's this?
var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin"; // For testing only. Don't store credentials in code.
var ca_certs_path = "./root-ca.pem";

// Optional client certificates if you don't want to use HTTP basic authentication.
// var client_cert_path = '/full/path/to/client.pem'
// var client_key_path = '/full/path/to/client-key.pem'

// Create a client with SSL/TLS enabled.
var { Client } = require("@opensearch-project/opensearch");
const { POINT_CONVERSION_HYBRID } = require("constants");
var fs = require("fs");
const { get } = require("http");
const { payload } = require("wechaty-puppet");


var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    //ca: fs.readFileSync(ca_certs_path),
    rejectUnauthorized: false//) if you're using self-signed certificates with a hostname mismatch.
    // cert: fs.readFileSync(client_cert_path),
    // key: fs.readFileSync(client_key_path)
  },
});

async function search() {
  // Create an index with non-default settings.

  var index_name = "books";
  var settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };

  var response = await client.indices.create({
    index: index_name,
    body: settings,
  });

  console.log("Creating index:");
  console.log(response.body);

  // Add a document to the index.
  var document = {
    title: "The Outsider",
    author: "Stephen King",
    year: "2018",
    genre: "Crime fiction",
  };

  var id = "1";

  var response = await client.index({
    id: id,
    index: index_name,
    body: document,
    refresh: true,
  });

  console.log("Adding document:");
  console.log(response.body);

  // Search for the document.
  var query = {
    query: {
      match: {
        title: {
          query: "The Outsider",
        },
      },
    },
  };

  var response = await client.search({
    index: index_name,
    body: query,
  });

  console.log("Search results:");
  console.log(response.body.hits);

  // Delete the document.
  var response = await client.delete({
    index: index_name,
    id: id,
  });

  console.log("Deleting document:");
  console.log(response.body);

  // Delete the index.
  var response = await client.indices.delete({
    index: index_name,
  });

  console.log("Deleting index:");
  console.log(response.body);
}

//create_index("timer_info")
async function create_index(index_name) {
  //given msg object, turn into JSON, and save in Opensearch DB, return? 
  var response = await client.indices.create({
    index: index_name,
    body: settings,
  });
  console.log("Creating index:");
  console.log(response.body);
}

async function put_document(index_name,document,id){
  // Add a document to the index.
  var response = await client.index({
    id: id,
    index: index_name,
    body: document,
    refresh: true,
  });
  console.log("Adding document:");
  console.log(response.body);
}


async function delete_document(index_name,id){
  // Delete the document.
  var response = await client.delete({
    index: index_name,
    id: id,
  });

  console.log("Deleting document:");
  console.log(response.body);
}


async function delete_index(index_name){
  // Delete the index.
  var response = await client.indices.delete({
    index: index_name,
  });
  console.log("Deleting index:");
  console.log(response.body);
}
//search().catch(console.log);

var document = {
  title: "The Outsider",
  author: "Stephen King",
  year: "2018",
  genre: "Crime fiction",
};
var doc1 = {
  "all_sales":{
    "童子铨":{
      "customer1":{
        "criteria:later-than-3-seconds":{
          "count":0,
          "messages":[
          ]
        }


      },
      "customer2":{

      }

    }
  }

  
}
var sales_record = {
  
}
var doc2 = {"_events":{},"_eventsCount":0,"id":"1010147","_payload":{"filename":"","fromId":"1688857614265501","id":"1010147","mentionIdList":[],"roomId":"","text":"heyhey asd","timestamp":1636135225000,"toId":"1688854422285964","type":7}};

async function get_all(index_name){
  var array = await query_document(index_name,query_all);
  console.log(array.length);
  for (let i = 0; i < array.length; i++) {
    var element = array[i];
    console.log(element);
  }   
}
var id = "1";
var query_all = {
  query: {
    match_all: {
    },
  },
};

var index_name = "juzibot-sales-msg-v2-4";
var q1 = {
  query: {
    match: {
      _payload: {
        text: "1007951",
      },
    },
  },
};

var q2 = {
  query: {
    match: {
      text: "hey"
    }
  }
}


var settings = {
  settings: {
    index: {
      number_of_shards: 4,
      number_of_replicas: 3,
    },
  },
};
//create_index("juzibot-sales-msg-v2-3").catch(console.log);
//put_document(index_name,doc2,id).catch(console.log);
//query_document(index_name,query).catch(console.log);
//delete_document(index_name,id).catch(console.log);
// delete_index("juzibot-sales-msg-v2-2").catch(console.log);
//get_all(index_name);

//create_index("juzibot-sales-metric-test").catch(console.log);
//put_document("juzibot-sales-metric-test",{},2).catch(console.log);
//id=1 
//put_document("juzibot-sales-metric",doc1,id).catch(console.log);
//query_document(index_name,query).catch(console.log);
var query = {
  query: {
    match_all: {
    },
  },
};

// async function query_document(index_name,query){
//   // Search for the document.
//   var response = await client.search({
//     index: index_name,
//     body: query,
//     size:100,
//   });
//   console.log("Search results:");
//   console.log(response.body.hits.hits.length);
//   return response.body.hits.hits;
// }


// client.get({
//   id: 1,
//   index: "juzibot-sales-metric"
// }).then(function(value) { 
//     console.log(JSON.stringify(value.body._source,null,4));
//     value.body._source.all_sales["童子铨"].customer1["criteria:later-than-3-seconds"].count +=1;
//     console.log(JSON.stringify(value.body._source,null,4));
//  })
//var sales_and_cus = {}
//delete_document("juzibot-sales-metric",2).catch(console.log);

var metric_index_doc = 
  {
    "曹啸": {
        "all_rooms": {
            "句子-一起作业 对接":{}
        }
    }
  } 
//delete_index("juzibot-sales-metric");
 //create_index("juzibot-sales-metric");
//put_document("juzibot-sales-metric",{},2).catch(console.log);
// id=2

// client.get({
//   id: 2,
//   index: "juzibot-sales-metric"
// }).then(function(value){
//   console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  
//   delete value.body._source.counter;
//   var all_room_count = 0;
//   for(var x in value.body._source){
//     value.body._source[x]["rooms_count"] = Object.keys(value.body._source[x].all_rooms).length;
//     all_room_count+= value.body._source[x]["rooms_count"]
//   }
//   value.body._source["names_count"] = Object.keys(value.body._source).length; //記得要考慮到外部的兩個特殊index
//   value.body._source["rooms_count"] = all_room_count; 
//   console.log("after"+JSON.stringify(value.body._source,null,4))
// })
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
var response_time = 60*1000
//var all_sales = ['童子铨','曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超','曹啸']
var all_sales = [
  // '童子铨','曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超'
  '曾璐','董森','宋宗强','陈子曦','冯伦','尹伯昊','李传君','李添','刘珉','孙文博','齐全喜'
  ,'陶好','田野','吴强强','王生良'
]
var doc_metric_id = 4;

//print_all_rooms()

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
//delete_document(index_metric,3);
//myfunc()

var juzi_corp_name = "北京句子互动科技有限公司"

async function check_timeout(){
  //if this time is cus, write timer; if last time is cus and this time is sales, clean timer 
  var value = await client.get({
    id: 2,
    index: index_metric
  })
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var room = '句子×booming执行群'
  var source = value.body._source; 
  var data = value.body._source.data; 
 var room_data = data["曹啸"]["all_rooms"]["句子×booming执行群"];
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
                // {range:{
                //   "payload.timestamp": {
                //     gte: "now-1d/d",
                //     lt: "now/s"
                //   }
                // }}
              ]
            }
          }
        }
    var response = await query_document(index_name,qq);
    //console.log(response)
    // for(var k=0; k<response.length;k++){
    var k = response.length-1;
      var obj = response[k]._source.payload; 
      var d = new Date(obj.timestamp)
      var s = d.toLocaleTimeString()
      var ss = d.toLocaleDateString()
      if(is_from_customer(response[k]) && this_time_is_sales_or_employee){ //last is customer, clean timeout
        // var tolerate_time = 2000;
        //   let mytimer = setTimeout(() => {  //msg.say('超过'+ (tolerate_time/1000).toString()+'秒没回');  
        //     console.log('超过'+ (tolerate_time/1000).toString()+'秒没回')
        //    }, tolerate_time);
        //   room_data["timer"] = mytimer
        clearTimeout(room_data["timer"]);
      }else if(is_from_other_employee(response[k])){
        //nothing
      }else if(is_from_sales(response[k])){
       //nothing
      } 
      // if(print_msg){
      console.log(
        ss+" "+s+" "+obj.roomInfo.topic+" "+
        obj.fromInfo.payload.name+
        ":"+
        obj.text + " "
        );
      // }
      // if(is_from_customer(response[k])){
      //   if(to_reply===false){
      //     //console.log("1st from customer ")
      //     to_reply = true; 
      //     to_reply_msg_time = d
      //   }
      // }else{
      //   if(to_reply===true){
      //     //console.log("1st reply")
      //     to_reply = false
      //     var replied_msg_time_sec = (d - to_reply_msg_time) /1000  //this - is ok? 
      //     //console.log("replied: "+replied_msg_time)
      //     //console.log("replied: "+Math.floor(replied_msg_time_sec/60)+" minutes and "+replied_msg_time_sec%60+" sec")
      //     if(replied_msg_time_sec > time_threshold_min * 60){
      //       crit_2_mins_count+=1; 
      //     }
      //     sum += replied_msg_time_sec; 
      //   }
      // }
    // }
    put_document(index_metric,value.body._source,doc_metric_id);
}
//check_timeout()
async function myfunc(){
  var value = await client.get({
    id: 2,
    index: index_metric
  })
  //put_document(index_metric,value.body._source,doc_metric_id);
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var source = value.body._source; 
  var data = value.body._source.data; 
  var total_csv_data = []
  var total_detail_data = []
  var sale_sum_time=0.0; 
  var sale_over2mins=0; 
  var sale_total_num = 0; 
  var sales_detail_data = []
  var sales_total_data = []
  for(var i in data){
    //console.log(JSON.stringify(i,null,4));
    if(i==='童子铨')continue; //testing 
    if(!all_sales.includes(i))continue;
    if(data[i]["role"]==="sales"){
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
                    gte: "now-1d/d",
                    lt: "now/s"
                  }
                }}
              ]
            }
          }
        }
        var response = await query_document(index_name,qq);
        //console.log(response);
        var to_reply = false; 
        var to_reply_msg_time = new Date(); //not know whether null is ok? 
        //OUTPUT TOTAL
        var [crit_2_min_count,avg_time,total_num,snum,emnum,cnum] = print_a_room(response);
        console.log("crit_2_min_count,avg_time,total_num:"+[crit_2_min_count,avg_time,total_num]);
        room = room.replace("句子互动服务群-",''); 
        
        total_csv_data.push({
          name: i,
          room: room,
          over2mins: crit_2_min_count,
          avg: avg_time,
          total:total_num,
          snum:snum,
          emnum:emnum,
          cnum:cnum,
        })

        //SALES TOTAL
        sale_sum_time += avg_time*total_num;
        sale_over2mins += crit_2_min_count; 
        sale_total_num += total_num; 

        //OUTPUT DETAIL
        var room_output_data =  Array.from(output_room(response));
        total_detail_data = total_detail_data.concat(room_output_data)
        // console.log("room_output_data:\n"+JSON.stringify(room_output_data,null,4));
        // console.log("room_output_data type:\n"+JSON.stringify(typeof room_output_data,null,4));
        
        //not work 
        // for(var room_i; room_i<room_output_data.length; room_i++){
        //   console.log(room_output_data[room_i])
        //   //total_detail_data.push(room_output_data[room_i]);
        // }
        
      }
      if(sale_total_num===0){
        sales_total_data.push({
          name: i,
          over2mins: sale_over2mins,
          avg: 0,
          total:0
        })
      }else{
        sales_total_data.push({
          name: i,
          over2mins: sale_over2mins,
          avg: (sale_sum_time/sale_total_num).toFixed(2),
          total:sale_total_num
        })
     }   
      sale_sum_time=0.0;
      sale_over2mins = 0;
      sale_total_num = 0;

    }
  }
  //quit double loop 
  var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  var s = new Date(Date.now()).toLocaleDateString("en-US", options);
  console.log(s)
  console.log(total_detail_data)
  //console.log("room_output_data:\n"+JSON.stringify(total_detail_data,null,4));
  //msg_detail_output("detail_1_day"+s,total_detail_data)
  //total_output("total_"+s,total_csv_data);
  //sales_total_output("sales_"+s,sales_total_data); 
}
//retrieve_id_from_channel(1032755)
//retrieve_room_from_name("句子互动服务群-安徽节点信息")
async function retrieve_room_from_name(room){
  if(room !== ""){
    console.log("is a room")
    var qq1 = {
      sort:[
        {"payload.timestamp":{"order":"asc"}}
      ],
      size:1000,
      query: {
        match: {
          "payload.roomInfo.topic.keyword":room
        }
      }
    }
    var channel_response = await query_document(index_name,qq1);
    print_a_room(channel_response,true);
  }else{
    console.log("is not a room")
  }
}



// const dividers = ["------","- - - - - - - - - - - - - - -"]
// var testdiv = ""
//retrieve_id_from_channel(1122788)
// function serialize_beautify_msg(texts){
  
// }

// function beautify(text){
//   var a = text.split(dividers[0])
//   var b = []
//   console.log(a,a.length)
//   for(var i=0; i<a.length; i++){

//     console.log(i,a[i])
//     var c = a[i].split(dividers[1])
//     console.log("splt:",c)
//     b = b.concat(c)
//   }
//   console.log(b,b.length)
//   return b[-1]
// }
//print_metric()
async function print_metric(){
  var value = await client.get({
    id: 3,
    index: index_metric
  })
  var source = value.body._source; 
  var data = value.body._source.data; 
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  for(var i in data){
    print(i)
  }
}

async function retrieve_id_from_channel(id){ //retrieve channel from id 

  //Retrieve ID MSG
  var value = await client.get({
    id: 3,
    index: index_metric
  })
  var source = value.body._source; 
  var data = value.body._source.data; 
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var qq = {
    query: {
      match: {
        "id":id
      }
    }
  }
  var response = await query_document(index_name,qq);
  //console.log("RES:",response[0]._source.payload.text);
  // beautify(response[0]._source.payload.text)

  //PRINT WHOLE ROOM
  if(response.length==1){
    var obj = response[0]._source.payload; 
    var room = obj.roomInfo.topic
    if(room !== ""){
      console.log("is a room")
      var qq1 = {
        sort:[
          {"payload.timestamp":{"order":"asc"}}
        ],
        size:1000,
        query: {
          match: {
            "payload.roomInfo.topic.keyword":room
          }
        }
      }
      var channel_response = await query_document(index_name,qq1);
      //print_a_room(channel_response);
    }else{
      console.log("is not a room")
    }
  }else if(response.length==0){
    console.log("no response")
  }else{
    console.log("more than 1 responses")
  }
  //assert just one or 0 
}

function is_from_customer(msg){
  //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
  //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
  return !all_sales.includes(msg._source.payload.fromInfo.payload.name) && //not sales
  (msg._source.payload.fromInfo.payload.corporation!==juzi_corp_name) //not employee
}
function is_from_sales(msg){
  //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
  //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
  return all_sales.includes(msg._source.payload.fromInfo.payload.name) 
}
function is_from_other_employee(msg){
  //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
  //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
  return !all_sales.includes(msg._source.payload.fromInfo.payload.name) && //not sales
  (msg._source.payload.fromInfo.payload.corporation===juzi_corp_name) //is employee
}
function output_room(response){
  var to_reply = false; 
  var to_reply_msg_time = new Date(); //not know whether null is ok? 
  var crit_2_mins_count = 0; 
  const time_threshold_min = 2;
  if(response.length===0){
    return false
  }
  var room_output_data = [];
  var customer_name = "";
  var customer_time = null;
  var customer_msg = "";
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
    // if(print_msg){
    //   console.log(
    //     ss+" "+s+" "+obj.roomInfo.topic+" "+
    //     obj.fromInfo.payload.name+
    //     ":"+
    //     obj.text + " "
    //     );
    //   }
    if(is_from_customer(response[k])){
      if(to_reply===false){
        //console.log("1st from customer ")
        to_reply = true; 
        to_reply_msg_time = d
        customer_name = obj.fromInfo.payload.name;
        customer_time = s; 
        customer_msg = obj.text; 
      }
    }else{
      if(to_reply===true){
        //console.log("1st reply")
        to_reply = false
        var replied_msg_time_sec = (d - to_reply_msg_time) /1000  //this - is ok? 
        //console.log("replied: "+replied_msg_time)
        //console.log("replied: "+Math.floor(replied_msg_time_sec/60)+" minutes and "+replied_msg_time_sec%60+" sec")
        if(replied_msg_time_sec > time_threshold_min * 60){
          crit_2_mins_count+=1; 

          room_output_data.push({
            name:name,
            room:room,
            customer_name:customer_name,
            msg_customer:customer_msg,
            msg_reply:obj.text,
            reply_time:(replied_msg_time_sec/60).toFixed(2),
            date:ss,
            time:s,
            msg_reply_id:obj.id,
          })
        }
        //sum += replied_msg_time_sec; 
      }
    }
  }
  return room_output_data
  // {id: 'name', title: 'Name'},
  // {id: 'room', title: 'Room'},
  // {id: 'customer_name', title: 'Customer Name'},
  // {id: 'msg_customer', title: 'Customer Fisrt Message'},
  // {id: 'msg_reply', title: 'Sales Reply Message'},
  // {id: 'reply_time', title: 'Reply Time (min)'},
  // {id: 'time', title: 'Message Time(min)'},
  // {id: 'msg_reply_id', title: 'Message ID'},

}

function print_a_room(response,print_msg=false){
  var to_reply = false; 
  var to_reply_msg_time = new Date(); //not know whether null is ok? 
  var crit_2_mins_count = 0; 
  const time_threshold_min = 2;
  var sum = 0.0; 
  if(response.length===0){
    return([0,0,0])
  }
  var snum=0,cnum=0,emnum=0; 
  for(var k=0; k<response.length;k++){
    var obj = response[k]._source.payload; 
    var d = new Date(obj.timestamp)
    var s = d.toLocaleTimeString()
    var ss = d.toLocaleDateString()
    if(is_from_customer(response[k]))cnum+=1;
    if(is_from_other_employee(response[k]))emnum+=1;
    if(is_from_sales(response[k]))snum+=1; 
    if(print_msg){
    console.log(
      ss+" "+s+" "+obj.roomInfo.topic+" "+
      obj.fromInfo.payload.name+
      ":"+
      obj.text + " "
      );
    }
      if(is_from_customer(response[k])){
        if(to_reply===false){
          //console.log("1st from customer ")
          to_reply = true; 
          to_reply_msg_time = d
        }
      }else{
        if(to_reply===true){
          //console.log("1st reply")
          to_reply = false
          var replied_msg_time_sec = (d - to_reply_msg_time) /1000  //this - is ok? 
          //console.log("replied: "+replied_msg_time)
          //console.log("replied: "+Math.floor(replied_msg_time_sec/60)+" minutes and "+replied_msg_time_sec%60+" sec")
          if(replied_msg_time_sec > time_threshold_min * 60){
            crit_2_mins_count+=1; 
          }
          sum += replied_msg_time_sec; 
        }
      }
    }
  var avg = (sum/response.length/60).toFixed(2)
  return [crit_2_mins_count,avg,response.length,snum,emnum,cnum]
}


function recalculate_index(value){
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  //value.body._source["data"] = JSON.parse(JSON.stringify(value.body._source)); 
  // for(var x in value.body._source){
  //   if(x!="data"){
  //     delete value.body._source[[x]]
  //   }
  // }

  var all_room_count = 0;
  for(var x in value.body._source.data){
    console.log("x is "+value.body._source.data[x]);
    if(value.body._source.data[x].all_rooms!=null){
      value.body._source.data[x]["rooms_count"] = Object.keys(value.body._source.data[x].all_rooms).length;
    }
    all_room_count+= value.body._source.data[x]["rooms_count"]
  }
  value.body._source["names_count"] = Object.keys(value.body._source.data).length; //記得要考慮到外部的兩個特殊index
  value.body._source["rooms_count"] = all_room_count; 
  console.log("after"+JSON.stringify(value.body._source,null,4));

}




const sales_output_head = "all_output/"
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function total_output(timerange,data){
  const csvWriter = createCsvWriter({
    path: sales_output_head+timerange+'total.csv',
    header: [
      {id: 'name', title: '销售名'},
      {id: 'room', title: '群聊名'},
      {id: 'over2mins', title: '回复超过2分钟次数'},
      {id: 'avg', title: '平均回复时间（分钟）'},
      {id: 'total', title: '总回复数'},
      {id: 'snum', title: '销售总回复数'},
      {id: 'emnum', title: '其他员工总回复数'},
      {id: 'cnum', title: '顾客总回复数'},
    ]
  }); 
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
}

function sales_total_output(timerange,data){
  const csvWriter = createCsvWriter({
    path: sales_output_head+timerange+'total.csv',
    header: [
      {id: 'name', title: '销售名'},
      {id: 'over2mins', title: '回复超过2分钟次数'},
      {id: 'avg', title: '平均回复时间（分钟）'},
      {id: 'total', title: '总回复数'},
    ]
  }); 
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
}



function msg_detail_output(timerange,data){
  const csvWriter = createCsvWriter({
    path: sales_output_head+timerange+'_room_detail.csv',
    header: [
      {id: 'name', title: '销售名'},
      {id: 'room', title: '群聊名'},
      {id: 'customer_name', title: '顾客名'},
      {id: 'msg_customer', title: '顾客发送消息'},
      {id: 'msg_reply', title: '销售回复消息'},
      {id: 'reply_time', title: '回复时长（分钟）'},
      {id: 'date', title: '回复日期'},
      {id: 'time', title: '回复日期点'},
      {id: 'msg_reply_id', title: '消息 ID'},
    ]
  });
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
}

function room_output(timerange,name,room,data){
  const tnrce = timerange+"_"+name+"_"+room+"_" ; //time, name,room,criteria 
  const csvWriter = createCsvWriter({
    path: sales_output_head+timerange+tnrce+'.csv',
    header: [
      {id: 'msg_customer', title: 'Customer Fisrt Message'},
      {id: 'msg_reply', title: 'Sales Reply Message'},
      {id: 'msg_reply_id', title: 'Message ID'},
      {id: 'time', title: 'Message Time'},
    ]
  });
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
}


// const fs = require('fs');
// const path = require('path');
// function mkdir(__dirname,name){
//   fs.mkdir(path.join(__dirname, name), (err) => {
//       if (err) {
//           return console.error(err);
//       }
//       console.log('Directory created successfully!');
//   });
// }



// function update_role(){
//   for(var x in value.body._source){
//     if(all_sales.includes(x)){ 
//       console.log('new name: role:sale');
//       value.body._source[x]['role'] = "sales"
//     }else if (msg._payload.fromInfo.corporation == juzi_corp_name){
//         console.log('new name: role:employee ');
//         value.body._source[x]['role'] = "employee";
//     }else{
//       //assert this role is customer
//       console.log('new name: role:customer ');
//       value.body._source[x]['role'] = "customer";
//     }
//   }
// }


//count function 
// client.get({
//   id: 2,
//   index: index_metric
// }).then(function(value){
//   console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
//   value.body._source["data"] = JSON.parse(JSON.stringify(value.body._source)); 
//   for(var x in value.body._source){
//     if(x!="data"){
//       delete value.body._source[[x]]
//     }
//   }

//   var all_room_count = 0;
//   for(var x in value.body._source.data){
//     console.log("x is "+value.body._source.data[x]);
//     value.body._source.data[x]["rooms_count"] = Object.keys(value.body._source.data[x].all_rooms).length;
//     all_room_count+= value.body._source.data[x]["rooms_count"]
//   }
//   value.body._source["names_count"] = Object.keys(value.body._source.data).length; //記得要考慮到外部的兩個特殊index
//   value.body._source["rooms_count"] = all_room_count; 

//   console.log("after"+JSON.stringify(value.body._source,null,4));
//   put_document(index_metric,value.body._source,doc_metric_id);
// })


// const ObjectsToCsv = require('objects-to-csv');
 
// // Sample data - two columns, three rows:
// const data = [
//   {code: 'CA', name: 'California'},
//   {code: 'TX', name: 'Texas'},
//   {code: 'NY', name: 'New York'},
// ];
 
// // If you use "await", code must be inside an asynchronous function:
// (async () => {
//   const csv = new ObjectsToCsv(data);
 
//   // Save to file:
//   await csv.toDisk('./test.csv');
 
//   // Return the CSV file as string:
//   console.log(await csv.toString());
// })();


// import {saveAs} from "file-saver";

// const { Parser } = require('json2csv');
// var Blob = require('node-blob');
// var FileSaver = require('file-saver');
// // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
// FileSaver.saveAs(blob, "helloworld.txt");
// const json2csvParser = new Parser();
// const csv = json2csvParser.parse(myCars);
// console.log(csv);
// var fileName = "1.csv"
// var blob = new Blob([csv], { type: 'application/vnd.ms-excel',fileName });
// FileSaver.saveAs(blob)