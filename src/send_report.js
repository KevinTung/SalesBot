// var now = new Date();
// dateWithTimeZone = (timeZone, year, month, day, hour, minute, second) => {
//   let date = new Date(Date.UTC(year, month, day, hour, minute, second));

//   let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
//   let tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
//   let offset = utcDate.getTime() - tzDate.getTime();

//   date.setTime( date.getTime() + offset );

//   return date;
// };
// var timezone_offset = 8
// var x = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 14-timezone_offset, 40, 0)

// var millisTill10 =  x - now;
// if (millisTill10 < 0) {
//      millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
// }
// console.log(x,now)
// console.log(millisTill10)
// setTimeout(function(){alert("It's 10am!")}, millisTill10);


//LARK PUPPET
import { PuppetLark } from 'wechaty-puppet-lark-2'

import {
  //EventMessagePayload,
  MessageType,
  FileBox,
}                           from 'wechaty-puppet'
const puppet = new PuppetLark({
  larkServer: {
    port: 1235,
  },
})

puppet.start().catch(async e => {
  console.error('Bot start() fail:', e)
  // await puppet.stop()
  process.exit(-1)
})

async function puppet_start(){
  //const myfile = FileBox.fromFile('assets/sales_picture.png')
  const target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
  const myfile = FileBox.fromFile('assets/total_12212021.xls')
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  console.log("HIIII")
  var tolerate_time = 3000;
     // if(msg.from().name()=='童子铨'){
     // setInterval(() => {  
     //   puppet.messageSendText(target_roomid, '超过'+ (tolerate_time/1000).toString()+'秒没回')  
     // }, tolerate_time);
     // }
    //  let timerID = setTimeout(() => {  
    //   myfunc()
    //  }, tolerate_time);
     
     //timer2 = JSON.parse(JSON.stringify(timer))
     // clearTimeout(timerID[Symbol.toPrimitive]())
     // console.log(timerID[Symbol.toPrimitive]())
 // await puppet.messageSendText(target_roomid, 'dong')

}
puppet_start()
// var vv = await puppet.roomList()
// for(var i in vv){
//   console.log(vv[i]["chat_id"])
//   var tt = await puppet.roomMemberList(vv[i]["chat_id"])
//   console.log(tt)
// }
// console.log(vv)




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
import { Client } from "@opensearch-project/opensearch";
import { POINT_CONVERSION_HYBRID } from "constants";
import fs from "fs";
import { get } from "http";
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


var index_name = "juzibot-sales-msg-v2-4";
var index_metric = "juzibot-sales-metric";
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

var all_sales = [
  // ,'曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超'
  '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强','undefined'
]
var doc_metric_id = 4;
var juzi_corp_name = "北京句子互动科技有限公司"


async function myfunc(){ 
  //ASSERT: if no chats, then won't output
  var value = await client.get({
    id: doc_metric_id,
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
    if(true){
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
                    gte: "now-1d/s",
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
        if(total_num!==0){ 
        //if(true){
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
        }

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
      // if(sale_total_num===0){
      //   sales_total_data.push({
      //     name: i,
      //     over2mins: sale_over2mins,
      //     avg: 0,
      //     total:0
      //   })
      // }else{
      if(sale_total_num !== 0){
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
  var date_string = new Date(Date.now()).toLocaleDateString("en-US", options);
  const sales_output_head = "all_output/"
  //console.log(s)
  //console.log(total_detail_data)
  //console.log("room_output_data:\n"+JSON.stringify(total_detail_data,null,4));
  var total_name = "customer_"+date_string+'.csv'
  var sales_name = "sales_"+date_string+'.csv'
  var detail_name = "detail_"+date_string+'.csv'

  msg_detail_output(sales_output_head+detail_name,total_detail_data) //path: path: sales_output_head+timerange+'_room_detail.csv',
  total_output(sales_output_head+total_name,total_csv_data); //path: sales_output_head+timerange+'total.csv',
  sales_total_output(sales_output_head+sales_name,sales_total_data); // path: sales_output_head+timerange+'total.csv',

  var target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
  const BBIWY_group_id = "oc_a1f098656192c592e21aae7175219d46"
  //target_roomid = BBIWY_group_id

  var report_chill_msg = "我每天都會像這樣定時傳三個文件"
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  await puppet.messageSendXLSFile(target_roomid, FileBox.fromFile(sales_output_head+total_name),total_name).catch(console.error)
     await puppet.messageSendXLSFile(target_roomid, FileBox.fromFile(sales_output_head+sales_name),sales_name).catch(console.error)
     await puppet.messageSendXLSFile(target_roomid, FileBox.fromFile(sales_output_head+detail_name),detail_name).catch(console.error)
  
  await puppet.messageSendText(target_roomid,report_chill_msg);
}




async function print_all_rooms(){
  var value = await client.get({
    id: doc_metric_id,
    index: index_metric
  })
  console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var data = value.body._source.data; 
  for(var i in data){
    console.log("."+i+".."+Object.keys(data[i]["all_rooms"]).length)
    for(var room in data[i]["all_rooms"]){
      console.log(".. "+room);     
    }
  }
}
myfunc()
//print_all_rooms()// COMMAND
// room_manipulation() COMMAND
async function room_manipulation(){
  var value = await client.get({
    id: doc_metric_id,
    index: index_metric
  })
  //console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var data = value.body._source.data; 
  // console.log(data['田野']["all_rooms"]["句子互动服务群-通天星"])
  // console.log(data['']
  
  var delete_list = ["曾璐","田野","秋","江湖小麻雀","小圆圆","Rt-黄蕾","ggoba","曹啸"]
  for(var i in delete_list){  
    delete data[delete_list[i]]
  }
  for(var i in data){
    console.log("."+i)
    for(var room in data[i]["all_rooms"]){
      console.log(".. "+room);     
    }
  }
  put_document(index_metric,value.body._source,doc_metric_id)
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


const dividers = ["------","- - - - - - - - - - - - - - -"]


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
  var customer_msgs = [];
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
      if(to_reply===false){
        to_reply = true; 
        to_reply_msg_time = d
        customer_name = obj.fromInfo.payload.name;
        customer_time = s; 
        customer_msgs.push({
            name:"",
            room:room,
            customer_name:customer_name,
            msg_customer:beautify_msg(obj.text),
            msg_reply:"",
            reply_time:-1,
            date:ss,
            time:s,
            tag:"顾客首次消息",
            msg_id:obj.id,
          }); 
      }
     else{ //to_relply == true; record the middle text for context
      customer_msgs.push({
            name:"",
            room:room,
            customer_name:customer_name,
            msg_customer:beautify_msg(obj.text),
            msg_reply:"",
            reply_time:-1,
            date:ss,
            time:s,
            tag:"顾客接续消息",
            msg_id:obj.id,
          });
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
          for(var i = 0; i<customer_msgs.length; i++){
               room_output_data.push(customer_msgs[i])
          }
          room_output_data.push({
            name:name,
            room:room,
            customer_name:"",
            msg_customer:"",
            msg_reply:beautify_msg(obj.text),
            reply_time:(replied_msg_time_sec/60).toFixed(2),
            date:ss,
            time:s,
            tag:"销售首次回复", 
            msg_id:obj.id,
          })
        }

        customer_msgs = [] //push all
       
      }
    }
  }
  return room_output_data
}

function msg_detail_output(path,data){
  const csvWriter = createCsvWriter({
    path: path,
    header: [
      {id: 'name', title: '销售名'},
      {id: 'room', title: '群聊名'},
      {id: 'customer_name', title: '顾客名'},
      {id: 'msg_customer', title: '顾客发送消息'},
      {id: 'msg_reply', title: '销售回复消息'},
      {id: 'reply_time', title: '回复时长（分钟）'},
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

function total_output(path,data){
  const csvWriter = createCsvWriter({
    path: path,
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
function sales_total_output(path,data){
  const csvWriter = createCsvWriter({
    path: path,
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