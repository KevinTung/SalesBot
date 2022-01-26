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

var name_index = "juzibot-sales-name";
var name_index_doc_id = 1 
var room_index = "juzibot-sales-room-2";

var all_sales = [
    '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强','孙文博','undefined','test'
  ]
  var post_sales = [
    '曹啸','田荣生','闫小娟','张玉晓'
  ]
var juzi_corp_name = "北京句子互动科技有限公司"
// print_all_rooms()
// create_index("sales_rooms").then((e)=>{console.log(e)})
//delete_index("sales_rooms")
//create_names()


const roles = ["sales","after_sales"]
async function create_names(){ //no postsales yet , just init
    var namedata = {}
    for(var i of all_sales){
        if(i==='undefined'){
            namedata[i] = {"role":"undefined","all_rooms":[]}
        }else namedata[i] = {"role":"sales","all_rooms":[]}
    }
    for(var i of post_sales){
        namedata[i] = {"role":"after_sales","all_rooms":[]}
    }
    
    var response = await query_document(room_index,query)
    response.forEach((e)=>{
        console.log(e._source)
        namedata[e._source["in_charge"]]["all_rooms"].push(e._source["room_name"])
    })
    console.log(namedata)
    put_document(name_index,namedata,name_index_doc_id)
}
//get_all_names(3)
async function get_all_names(option){
    //1:all,2:sales,3:post_sales
    var value = await client.get({
        id: name_index_doc_id,
        index: name_index
      })
    var source = value.body._source
    if(option==1){
        return Object.keys(source)
    }else if(option==2){
        var r = []
        Object.keys(source).forEach((e)=>{
            if(source[e]['role']==="sales")r.push(e)
        })
        return r
    }else if(option==3){
        var r = []
        Object.keys(source).forEach((e)=>{
            if(source[e]['role']==="after_sales")r.push(e)
        })
        return r
    } 
}
// update_names()
//after update allsales, postsales, and room
async function update_names(){ //no postsales yet , just init
    var value = await client.get({
        id: name_index_doc_id,
        index: name_index
      })
    var source = value.body._source

    for(var i of all_sales){
        if(!Object.keys(source).includes(i)){
            source[i] = {"role":"sales","all_rooms":[]}
        }
    }
    for(var i of post_sales){
        if(!Object.keys(source).includes(i)){
            source[i] = {"role":"after_sales","all_rooms":[]}
        }
    }
    print(source)
    // var response = await query_document(room_index,query)
    // response.forEach((e)=>{
    //     console.log(e._source)
    //     namedata[e._source["in_charge"]]["all_rooms"].push(e._source["room_name"])
    // })
    // console.log(namedata)
    // put_document(name_index,namedata,name_index_doc_id)
}

// var t = await get_all_rooms(room_index)
// console.log(t)

get_a_room(room_index,"句子互动服务群-小壳")
async function get_a_room(room_index,room_name){
    var qq = {
        size:1000,
        query: {
            match: {
                "room_name.keyword":room_name
            },
        }
      }
    var response = await client.search({
      index: room_index,
      body: qq,
    })
    console.log(response.body.hits.hits)
    return response.body.hits.hits
}


async function get_all_rooms(room_index){
// Search for the document.
    var query = {
        query: {
        match_all: {
        },
        },
    };
    var response = await client.search({
        index: room_index,
        body: query,
        size:1000,
    });
    // console.log("Search results:");
    //console.log(response.body.hits.hits);
    var r = []
    response.body.hits.hits.forEach((e)=>{
        r.push(e._source)
    });
    return r
}
async function delete_index(index_name){
    // Delete the index.
    var response = await client.indices.delete({
      index: index_name,
    });
    console.log("Deleting index:");
    console.log(response.body);
  }

async function print_all_rooms(){
  var value = await client.get({
    id: doc_metric_id,
    index: index_metric
  })
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  
  var data = value.body._source.data; 
  var new_data = {}
  var counter = 0
  var zeros = 0
  var aboveone = 0
  var exactone = 0
  var error =0 
  var error_rooms = {}
  var no_employee = ["句子互动服务群-麻雀小样"]
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
       delete new_data[room]["timestamp"]
       new_data[room]["phase"] = "pre-sales"
      
       var res = []
       var postres = []
       var employees = []
       if(!Object.keys(new_data[room]).includes("employee")){
           console.log("NO EMPLOYEE",room,new_data[room])
           error+=1 
       }else{
            for(var j of Object.keys(new_data[room]["employee"])){
                if(all_sales.includes(j)){
                    res.push(j)
                }
                if(post_sales.includes(j)){
                    postres.push(j)
                }employees.push(j)

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
            new_data[room]["in_charge"] = res[0] //choose the first one 
       }else{
        exactone += 1
        new_data[room]["in_charge"] = res[0]        
       }
       new_data[room]["sales"] = res
       new_data[room]["after_sales"] = postres
       new_data[room]["employee"] = employees 
       new_data[room]["room_name"] = room
    }
  }
  console.log(counter, zeros, exactone, aboveone)
  console.log("error",error)
  console.log(new_data)
  
  var doc_id = 100
  for(var i in new_data){
      console.log(doc_id,new_data[i])
    await put_document(room_index,JSON.stringify(new_data[i]),doc_id)
      doc_id+=1
  }

  //console.log("ERROR ROOMS:",error_rooms)
}
//update_rooms() //cannot do this, need to do this in salesbot 
//get_all_rooms(room_index)
async function update_rooms(){
    var value = await get_all_rooms(room_index)
    //console.log("get all rooms:\n"+ JSON.stringify(value,null,4));
    for(var i of value){
        console.log(i)
    }
    //console.log("ERROR ROOMS:",error_rooms)
  }

//AFTER update sales
//track incharge, all sales? , all post sales ? , sales, employee, ... 


async function put_document(index_name,document,id){
    // Add a document to the index.
    console.log("Adding document1:");
    var response = await client.index({
      id: id,
      index: index_name,
      body: document,
      refresh: true,
    });
    console.log("Adding document2:");
    console.log(response.body);
}
function clone(a) {
    return JSON.parse(JSON.stringify(a));
 }
 function print(a){
     console.log(a)
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
  function is_from_post_sales(msg){
    //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
    //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
    return post_sales.includes(msg._source.payload.fromInfo.payload.name) 
  }
  function is_from_other_employee(msg){
    //console.log("is sales?"+all_sales.includes(msg._source.payload.fromInfo.payload.name));
    //console.log("is employee?"+(msg._source.payload.fromInfo.payload.corporation===juzi_corp_name).toString());
    return !all_sales.includes(msg._source.payload.fromInfo.payload.name) && //not sales
    (msg._source.payload.fromInfo.payload.corporation===juzi_corp_name) //is employee
  }
  async function create_index(index_name) {
    //given msg object, turn into JSON, and save in Opensearch DB, return? 
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
  }