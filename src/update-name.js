



import config from 'config';
const config_all = config.get('All');
"use strict"; //what's this?
import * as fs from 'fs'
var host = config_all.dbConfig.host;
var protocol = config_all.dbConfig.protocol;
var port = config_all.dbConfig.port;
var auth = config_all.dbConfig.auth; 
import { Client } from "@opensearch-project/opensearch";
var client = new Client({
    node: protocol + "://" + auth + "@" + host + ":" + port,
    ssl: {
        rejectUnauthorized: false//) if you're using self-signed certificates with a hostname mismatch.
    },
});

var msg_index = config_all.index.msg;
var juzi_corp_name = config_all.corp.name
var name_index = config_all.index.name.index
var name_index_doc_id = config_all.index.name.docId
var room_index = config_all.index.room
var tolerate_time = config_all.vika.updateTime
var backup_id = config_all.index.name.backup
var sales_list = config_all.names.sales
var after_sales_list = config_all.names.after_sales

// var all_sales = ['童子铨','曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超']
// change_room("李传君","吴强强","句子科技服务群-【金佰利】")
// await update_name(all_sales)
// await get_name_list()
// await delete_name('曾璐')
// await delete_name('韩祥宇')
// await delete_name('王建超')
// delete_room('孙文博',"句子互动服务群-511专家")
update_name(sales_list,after_sales_list)
async function add_room(name,room){
  var value = await client.get({
      id: name_index_doc_id,
      index: name_index
    })
    value = value.body._source
  await put_document(name_index,JSON.stringify(value),backup_id)

  var names = Object.keys(value)
  if(!names.includes(name)){
    console.log("add_room error: no name!")
    return 
  } 

  var rooms = value[name]['all_rooms']
  if(rooms.includes(room)){
    console.log("add_room error: already has room!")
    return 
  }

  value[name]['all_rooms'].push(room)
  console.log('after',JSON.stringify(value,null,4))
  await put_document(name_index,JSON.stringify(value),name_index_doc_id)
}

async function delete_room(name,room){
  var value = await client.get({
      id: name_index_doc_id,
      index: name_index
    })
    value = value.body._source
  await put_document(name_index,JSON.stringify(value),backup_id)

  var names = Object.keys(value)
  if(!names.includes(name)){
    console.log("delete_room error: no name!")
    return 
  } 

  var rooms = value[name]['all_rooms']
  if(!rooms.includes(room)){
    console.log("delete_room error: no room to delete!")
    return 
  }
  var index =value[name]['all_rooms'].indexOf(room)
  value[name]['all_rooms'].splice(index,1)
  console.log('after',JSON.stringify(value,null,4))
  //await put_document(name_index,JSON.stringify(value),name_index_doc_id)
}

async function change_room(old_name,new_name,room){
  var value = await client.get({
    id: name_index_doc_id,
    index: name_index
  })
  value = value.body._source
  await put_document(name_index,JSON.stringify(value),backup_id)

  var names = Object.keys(value)
  if(!names.includes(old_name)){
    console.log("change_name error: no old name!")
    return 
  }  
  if(!names.includes(old_name)){
    console.log("change_name error: no new name!")
    return 
  }  

  var old_index =value[old_name]['all_rooms'].indexOf(room)
  if(old_index===-1){
    console.log("change_name error: no room in old name!")
    return 
  }
  var new_index =value[new_name]['all_rooms'].indexOf(room)
  if(new_index!==-1){
    console.log("change_name error: room existed in new name!")
    return 
  }

  value[old_name]['all_rooms'].splice(old_index,1)
  value[new_name]['all_rooms'].push(room)
  //console.log('after',JSON.stringify(value,null,4))
  await put_document(name_index,JSON.stringify(value),name_index_doc_id)
}

async function add_name(name,role){

  var value = await client.get({
    id: name_index_doc_id,
    index: name_index
  })
  console.log("adding:",name," to:",role);
  value = value.body._source
  await put_document(name_index,JSON.stringify(value),backup_id)
  var names = Object.keys(value)
  if(names.includes(name)){
    console.log("add_name error: already have this name!")
    return 
  }  
  if(role==='sales'){
    value[name] = {
      "role":'sales',
      "all_rooms": []
    }
  }else if(role==='after_sales'){
    value[name] = {
      "role":'after_sales',
      "all_rooms": []
    }
  }else{
    console.log("add_name error: no such role!")
  }
  //console.log('after',value)
  await put_document(name_index,JSON.stringify(value),name_index_doc_id)
}

async function update_name(sales_list,after_sales_list,to_delete_name=false){
 
  var value = await client.get({
    id: name_index_doc_id,
    index: name_index
  })
  value = value.body._source
  var names = Object.keys(value)
  console.log("origin:",names,"new sales:",sales_list,"new after sales:",after_sales_list);
  //check duplicate
  for(var name of sales_list){
    if(after_sales_list.includes(name)){
      console.log("duplicate names in both list!")
      return
    }
  }
  
  for(var i in sales_list){
    if(!names.includes(sales_list[i])){
      await add_name(sales_list[i],'sales')
    }
  }
  for(var i in after_sales_list){
    if(!names.includes(after_sales_list[i])){
      await add_name(after_sales_list[i],'after_sales')
    }
  }

  if(to_delete_name===true){
    for(var i in names){
      if(!sales_list.includes(names[i]) && !after_sales_list.includes(names[i])){
        await delete_name(names[i])
      }
    }
  }
}
async function delete_name(name){

  var value = await client.get({
    id: name_index_doc_id,
    index: name_index
  })
  console.log("deleting:",name);
  value = value.body._source
  await put_document(name_index,JSON.stringify(value),backup_id)
  var names = Object.keys(value)
  if(!names.includes(name)){
    console.log("delete name error: this name doesn't exists!")
    return 
  }  
  delete value[name]
  //console.log('after',value)
  await put_document(name_index,JSON.stringify(value),name_index_doc_id)
}

async function get_name_list(){

  var value = await client.get({
    id: name_index_doc_id,
    index: name_index
  })
  console.log("name list\n"+JSON.stringify(value.body._source,null,4));
}


async function put_document(index_name, document, id) {
  // Add a document to the index.
  console.log("Adding document1:");
  var response = await client.index({
      id: id,
      index: index_name,
      body: document,
      refresh: true,
  });
  //console.log(response)
}
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