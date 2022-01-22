//LARK PUPPET
import { PuppetLark } from 'wechaty-puppet-lark-2'
import { Vika } from "@vikadata/vika";
const vika = new Vika({ token: "uskFCOzapV3u5AcryXEpG1U", fieldKey: "name" });
import {Feishu} from 'lark-js-sdk';
let lark = new Feishu('cli_a11cb78f1a78900b', 'v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB');
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
const tolerate_time = 60*1000;
async function puppet_start(){
  //const myfile = FileBox.fromFile('assets/sales_picture.png')
  const target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
  const myfile = FileBox.fromFile('assets/total_12212021.xls')
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  console.log("HIIII")
  myfunc()
  let timerID = setInterval(() => {  
    myfunc()
  }, tolerate_time);
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

const Bot_test_group_id = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
const BBIWY_group_id = "oc_a1f098656192c592e21aae7175219d46"
//target_roomid = BBIWY_group_id
var all_sales = [ //ASSERT: all sales need to have a room ID in sales2chat
  '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强','undefined',"孙文博"//show which room is undefined 
]
var post_sales = [
  '曹啸','田荣生','闫小娟','张玉晓'
]
var alert_group = "oc_151f493e3d8b15ded4b41520a84a2739"
var sales2chat = {
  '董森':"oc_7ff99d4403ba04a6129dfb737e24739f", 
  '宋宗强':"oc_df395b0182a51cec39b09f81534a09f2", 
  '陈子曦':"oc_e75a4dcf83bb049b2cf8b3268d097f75", 
  '冯伦':"oc_6e7e17eb110be8b22c45fa1f84a92fe1", 
  '李传君':"oc_a67d0ad8d2eee6520217ba5f5ab59879", 
  '吴强强':"oc_94d5b1536c35c5bb0e2474d6c5a10d69",
  '孙文博':"oc_81d4b76dae3a7bcfece6f9b45bce9a4e",
  'undefined':"oc_e297d4bc1d7e1747c995c7822e79a31f"
}
var doc_metric_id = 4;
var juzi_corp_name = "北京句子互动科技有限公司"


async function myfunc(){ 
  //ASSERT: if no chats, then won't output
  var value = await client.get({
    id: doc_metric_id,
    index: index_metric
  })
  //put_document(index_metric,value.body._source,doc_metric_id);
  //console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
  var data = value.body._source.data; 
  var total_csv_data = []
  var vika_total_csv_data = []
  var total_detail_data = []
  var sale_sum_time=0.0; 
  var sale_over2mins=0; 
  var sale_total_num = 0; 
  var sales_detail_data = []
  var sales_total_data = []
  var sales_date , customer_date
  
  //pull all vika data, check updates, see whether phase change (inconsistency with local) if so, update metric.
  //update metric phase: tag origin room of sales to "post sales", add room to post sales (also tag "post sales") 
  //for each room in metric, add "phase" 
  //sales bot need to modify the sales_search; need to decide whether to search for sales or presales.   


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
                    gte: "now/d",
                    lt: "now/s"
                  }
                }}
              ]
            }
          }
        }
        sales_date = "one day ago"
        var response = await query_document(index_name,qq);
        //console.log(response);
        var to_reply = false; 
        var to_reply_msg_time = new Date(); //not know whether null is ok? 
        //OUTPUT TOTAL
        var crit_2_min_count,avg_time,total_num,snum,emnum,cnum,last_replier,not_replied_time,last_replier,not_replied_time
        if(response.length>0){
           [crit_2_min_count,
            avg_time,
            total_num,
            snum,
            emnum,
            cnum,
            last_replier,
            not_replied_time]= print_a_room(response);
            //NOT REPLY Level ; how to make sure that each level is alerted only once? 
            var cycle_minutes = tolerate_time/60/1000
            var need_send_message = false
            var card_color 
            if(5 < not_replied_time && not_replied_time < 6){//alert at 5
              need_send_message = true
              card_color = "turquoise"
            }else if(Math.floor(not_replied_time) == 10  ){ //INFO: Floor operation is due to cycletime 1 mintues
              need_send_message = true
              card_color = "yellow"
            }else if(Math.floor(not_replied_time) == 20  ){
              need_send_message = true
              card_color = "orange"
            }else if(Math.floor(not_replied_time) == 30  ){
              need_send_message = true
              card_color = "red"
            }else if( (Math.floor(not_replied_time)%10==0) &&  (Math.floor(not_replied_time)/10>=4)  ){//40-41, 50-51, ....
              need_send_message = true
              card_color = "purple"
            }else{
              need_send_message = false
            }
            
            if(need_send_message){
              mycard.elements[0]["content"] = `**${last_replier}** 的消息在 **${i}** 负责的 **${room}** 已经超过 **${Math.floor(not_replied_time)}** 分钟没被回复啦! 加油加油​${"⛽️"}`;
              if(room==undefined){
                mycard.elements[0]["content"] += `\\n**${room} 还没有销售，请添加一位销售`
              }
              mycard.header.template = card_color
              if(not_replied_time>20){
                lark.message.send({
                  chat_id: alert_group ,
                  msg_type: 'interactive',
                  card:mycard,
                });
              }
              lark.message.send({
                chat_id: sales2chat[i] ,
                msg_type: 'interactive',
                card:mycard,
              });
            }
        }else{
          [crit_2_min_count,avg_time,total_num,snum,emnum,cnum,last_replier,not_replied_time] = [0,0,0,0,0,0,"",0]
        }


        console.log("crit_2_min_count,avg_time,total_num,snum,emnum,cnum,last_replier,not_replied_time:"+[crit_2_min_count,avg_time,total_num,snum,emnum,cnum,last_replier,not_replied_time]);
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
            //date:customer_date
          })
          vika_total_csv_data.push({
            name: i,
            room: room,
            over2mins: crit_2_min_count,
            avg: parseFloat(avg_time),
            total:total_num,
            snum:snum,
            emnum:emnum,
            cnum:cnum,
            last_replier:last_replier,
            not_replied_time:parseFloat(not_replied_time)
            //date:customer_date
          })
          // if(vika_total_csv_data.length == 10){
          //   await vika_export_customer_record(vika_total_csv_data)
          //   //sleep(300)
          //   vika_total_csv_data = []
          // }
        }
        
        
        
        //SALES TOTAL
        sale_sum_time += avg_time*total_num;
        sale_over2mins += crit_2_min_count; 
        sale_total_num += total_num; 

        //OUTPUT DETAIL
        var room_output_data =  Array.from(output_room(response));
        total_detail_data = total_detail_data.concat(room_output_data)
       
        
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
  if(vika_total_csv_data.length > 0){ //must 
    await vika_export_customer_record(vika_total_csv_data)
    vika_total_csv_data = []
  }else{
    console.error("NO RECORDS YET!")
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

  
  
  var report_chill_msg = "我每天都會像這樣定時傳三個文件"
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  // await puppet.messageSendXLSFile(target_roomid, FileBox.fromFile(sales_output_head+total_name),total_name).catch(console.error)
  //    await puppet.messageSendXLSFile(target_roomid, FileBox.fromFile(sales_output_head+sales_name),sales_name).catch(console.error)
  //    await puppet.messageSendXLSFile(target_roomid, FileBox.fromFile(sales_output_head+detail_name),detail_name).catch(console.error)
  
  // await puppet.messageSendText(target_roomid,report_chill_msg);

  //send to vika 
  //vika_export_customer_record(total_csv_data)
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
function print_a_room(response,print_msg=false){//ASSERT response length > 0 
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
    var last_replier,not_replied_time
    for(var k=response.length-1; k>=0;k--){
      var replier = response[k]._source.payload.fromInfo.payload.name
      if(!is_from_customer(response[k]) && k==response.length-1){
          //console.log("**Last replier is sales or employee! GOOD!")
          last_replier = "句子员工:"+replier
          not_replied_time = 0
          break;
      }
      else if(!is_from_customer(response[k])){ 
          var obj = response[k+1]._source.payload; 
          var d = new Date(obj.timestamp)
          var now = new Date()
          var s = d.toLocaleTimeString()
          var ss = d.toLocaleDateString()
          not_replied_time = ((now-d)/1000/60).toFixed(2)  //this - is ok? 
          //console.log("**NOT REPLIED TIME:", not_replied_time)

          //switch cases: if in 10,20,...alert, else not alert 
      //    if(not_replied_time > time_threshold_min * 60 * 1000){
      //         crit_2_mins_count+=1; 
      //     }    
          last_replier = "客户:"+response[k+1]._source.payload.fromInfo.payload.name
          break;            
      }
      if(is_from_customer(response[k]) && k==0){
        var obj = response[k]._source.payload; 
          var d = new Date(obj.timestamp)
          var now = new Date()
          var s = d.toLocaleTimeString()
          var ss = d.toLocaleDateString()
          not_replied_time = ((now-d)/1000/60).toFixed(2)
        last_replier = "客户:"+replier
      }
    }
  
  var avg = (sum/response.length/60).toFixed(2)
  return [crit_2_mins_count,avg,response.length,snum,emnum,cnum,last_replier,not_replied_time]
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

//VIKA MODULE 
var vika_datasheet_id = "dstedTCmf1RnY3b6gc"
var vika_headermap =  [
  {id: 'name', title: "﻿销售名"},
  {id: 'room', title: '群聊名'},
  {id: 'over2mins', title: '回复超过2分钟次数'},
  {id: 'avg', title: '平均回复时间（分钟）'},
  {id: 'total', title: '总回复数'},
  {id: 'snum', title: '销售总回复数'},
  {id: 'emnum', title: '其他员工总回复数'},
  {id: 'cnum', title: '顾客总回复数'},
  {id: 'last_replier', title: '最后说话者'},
  {id: 'not_replied_time', title: '销售未回覆时间'},
  ]
const datasheet = vika.datasheet(vika_datasheet_id);
//DEV: if the entries are modified, then need to modify vika_headermap
async function vika_export_customer_record(datas){

  //ASSERT: No Duplicated data! Otherwise need to create a Created Room Dictionary, so that deuplicated rooms won't be recreated
  console.log(datas.length)

  //pull all data today, map records -> roomname; for each room in today's record, check whether it is in today. 
  var entries = []
  var update_entries = []
  var a3 = await datasheet.records.query({ 
    filterByFormula: `AND(NOT(BLANK()),IS_AFTER({上次更新时间}，TODAY()))`,
  })
  //if is post_sales? if new day, don't know whether it is post sales? 
  /// if post sales, responsible is post_sales 
  //when to check? 
  //if already post sales, then ? 
  //if new day, new room?  CREATE must be presales

  //need to update? 
  //need to create? 
  //who takes responsibility? 
  //what is the new phase? 

  //phase: pre, post, end 
  //how to get "phase changed?" need to save a local version? will i need to take metric out every time? 

  if (a3.success) {
    console.log("succeeded queried",a3.data);
  } else {
  console.error(a3);
  return;
  }
  console.log(a3)
  
  var all_rooms = {}
  for(var rec of a3.data.records){
    //console.log(rec)
    var key = rec["fields"]["﻿销售名"].concat(",",rec["fields"]['群聊名'])
    all_rooms[key] = rec
  }
  console.log(all_rooms)

  for(var data of datas){
    var salesname = data["name"] //need sales and roomname to uniquely identify a record
    var roomname = data["room"]
    var key = salesname.concat(",",roomname)
    console.log(roomname)
    if(Object.keys(all_rooms).includes(key)){ //update
          var update_entry = {}
          for(let i of vika_headermap){
              update_entry[i["title"]] = data[i["id"]]
          }
          //console.log("update:",update_entry)
          //console.log({recordId: all_rooms[roomname]["recordId"],"fields":update_entry})
          //console.log("record id:",a3.data.records[0][recordId])
          update_entries.push({recordId: all_rooms[key]["recordId"],"fields":update_entry})
      
    }else{ //create
      var entry = {}
      for(let i of vika_headermap){
          entry[i["title"]] = data[i["id"]]
      }
     
      entries.push({"fields":entry})
    }   
  }
  console.log("CREATE:",entries.length,"entries")
  if(entries.length > 0){
    
    var upload_entries = []
    for(var i in entries){
      //console.log(i)
      upload_entries.push(entries[i])
      if( (i%10==9) || (i==entries.length-1)){
        console.log("i==",i,"now create uploading...");
        await datasheet.records.create(
          upload_entries
          ).then(response => {
              if (response.success) {
               console.log("succeeded");
              } else {
              console.error(response);
              }
          })  
          upload_entries = []
      }
      if(i%40==39){ //4 times break 1 sec; the limit is 5times/sec 
        sleep(1000)
      }
      
    }
  }
  sleep(1000)
  console.log("UPDATE:",update_entries.length,"entries")
  if(update_entries.length>0){
    var upload_update_entries = []
    for(var i in update_entries){
      //console.log(i)
      upload_update_entries.push(update_entries[i])
      if( (i%10==9) || (i==update_entries.length-1)){
        console.log("i==",i,"now update uploading...");
        await datasheet.records.update(
          upload_update_entries
          ).then(response => {
              if (response.success) {
               console.log("succeeded");
              } else {
              console.error(response);
              }
          })  
          upload_update_entries = []
      }
      if(i%40==39){
        sleep(1000)
      }
      
    }
    
  }

}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


var mycard =  {
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

puppet_start()