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
var all_sales = ['童子铨','曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超']
var juzi_corp_name = "北京句子互动科技有限公司"
async function myfunc(){
  var value = await client.get({
    id: 2,
    index: index_metric
  })
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var source = value.body._source; 
  var data = value.body._source.data; 
  
  for(var i in data){
    console.log(JSON.stringify(i,null,4));
    if(data[i]["role"]==="sales"){
      for(var room in data[i]["all_rooms"]){
        console.log("\nroom: "+room);
                
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
                //     lt: "now/d"
                //   }
                // }}
              ]
            }
          }
        }
        var response = await query_document(index_name,qq);
        //console.log(response);
        var to_reply = false; 
        var to_reply_msg_time = new Date(); //not know whether null is ok? 
        print_a_room(response)
        // for(var k=0; k<response.length;k++){
        //   //console.log("name:"+response[k]._source.payload.fromInfo.payload.name);
        //   //console.log("  "+response[k]._source.payload.text);
        //   var obj = response[k]._source.payload; 
        //   var d = new Date(obj.timestamp)
        //   var s = d.toLocaleTimeString()
        //   var ss = d.toLocaleDateString()
          
        //   console.log(
            
        //     ss+" "+s+" "+obj.roomInfo.topic+" "+
        //     obj.fromInfo.payload.name+
        //     ":"+
        //     obj.text + " "
        //     );
        //   if(is_from_customer(response[k])){
            
        //     if(to_reply===false){
        //       console.log("1st from customer ")
        //       to_reply = true; 
        //       to_reply_msg_time = d
        //     }
        //   }else{
            
        //     if(to_reply===true){
        //       console.log("1st reply")
        //       to_reply = false
        //       var replied_msg_time = (d - to_reply_msg_time)/1000  //this - is ok? 
        //       //console.log("replied: "+replied_msg_time)
        //       console.log("replied: "+Math.floor(replied_msg_time/60)+" minutes and "+replied_msg_time%60+" sec")
        //     }
        //   }
        // }
        
      }
    }
  }
}
//myfunc()
//retrieve_id_from_channel(1032755)
async function retrieve_id_from_channel(id){
  var value = await client.get({
    id: 2,
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
  console.log(response.length);
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
      print_a_room(channel_response);
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


function print_a_room(response){
  var to_reply = false; 
  var to_reply_msg_time = new Date(); //not know whether null is ok? 
  for(var k=0; k<response.length;k++){
    //console.log(k);
    //console.log(response[k])
    //console.log("name:"+response[k]._source.payload.fromInfo.payload.name);
    //console.log("  "+response[k]._source.payload.text);
    var obj = response[k]._source.payload; 
    var d = new Date(obj.timestamp)
    var s = d.toLocaleTimeString()
    var ss = d.toLocaleDateString()
    
    console.log(
      
      ss+" "+s+" "+obj.roomInfo.topic+" "+
      obj.fromInfo.payload.name+
      ":"+
      obj.text + " "
      );

      if(is_from_customer(response[k])){
            
        if(to_reply===false){
          console.log("1st from customer ")
          to_reply = true; 
          to_reply_msg_time = d
        }
      }else{
        
        if(to_reply===true){
          console.log("1st reply")
          to_reply = false
          var replied_msg_time = (d - to_reply_msg_time)/1000  //this - is ok? 
          //console.log("replied: "+replied_msg_time)
          console.log("replied: "+Math.floor(replied_msg_time/60)+" minutes and "+replied_msg_time%60+" sec")
        }
      }
    }
    
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
//   put_document(index_metric,value.body._source,2);
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
// const myCars = [
//   {
//     "car": "Audi",
//     "price": 40000,
//     "color": "blue"
//   }, {
//     "car": "BMW",
//     "price": 35000,
//     "color": "black"
//   }, {
//     "car": "Porsche",
//     "price": 60000,
//     "color": "green"
//   }
// ];

// const json2csvParser = new Parser();
// const csv = json2csvParser.parse(myCars);
// console.log(csv);
// var fileName = "1.csv"
// var blob = new Blob([csv], { type: 'application/vnd.ms-excel',fileName });
// FileSaver.saveAs(blob)

const sales_output_head = "all_output/"
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: sales_output_head+'out.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'surname', title: 'Surname'},
    {id: 'age', title: 'Age'},
    {id: 'gender', title: 'Gender'},
  ]
});

const data = [
  {
    name: 'John',
    surname: 'Snow',
    age: 26,
    gender: 'M'
  }, {
    name: 'Clair',
    surname: 'White',
    age: 33,
    gender: 'F',
  }, {
    name: 'Fancy',
    surname: 'Brown',
    age: 78,
    gender: 'F'
  }
];

csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));