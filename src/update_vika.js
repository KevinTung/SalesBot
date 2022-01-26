

/*
    cycle: 1 min
    ASSERT: room_index will only be manually update 
        room_doc lifecycle: created in sales_bot when capture new room; and updated manually 
    
    check manual updates in [>1] mins (2 min?) time
    if modified and update, need to check all update throughout the downtime

    ASSERT now we have the right meta data of a group 
    
    calculate metric as usual  
    upload 
*/
 
"use strict"; //what's this?
var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin";
import { Client } from "@opensearch-project/opensearch";
var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    rejectUnauthorized: false//) if you're using self-signed certificates with a hostname mismatch.
  },
});
import { Vika } from "@vikadata/vika";
const vika = new Vika({ token: "uskFCOzapV3u5AcryXEpG1U", fieldKey: "name" });
var room_index = "juzibot-sales-room-2";
var juzi_corp_name = "北京句子互动科技有限公司"
var msg_index = "juzibot-sales-msg-v2-4";
var name_index = "juzibot-sales-name";
var name_index_doc_id = 1 
async function query_document(index_name,query){
  // Search for the document.
  
  var response = await client.search({
    index: index_name,
    body: query,
  });
//   console.log("Search results:");
//   console.log(response.body.hits.hits.length);
  return response.body.hits.hits;
}
//VIKA Interaction: check the phase and check sales, post sales to be consistant 
var sales_list = await get_all_names(2)
var after_sales_list = await get_all_names(3)
var all_sales = sales_list.concat(after_sales_list)
calculate_metric()
async function calculate_metric(){ 
    //ASSERT: calculate only today's metric, so the metric only depends on room, instead of in_charge and phase
    //in_charge might be "" ?
    var rooms = await get_all_rooms(room_index) //must not duplicate
    console.log("room db length:",rooms.length)
    sales_list = await get_all_names(2)
    after_sales_list = await get_all_names(3)
    all_sales = sales_list.concat(after_sales_list)
    var vika_total_csv_data = []
    //console.log(rooms)
    for(var room of rooms){
        var room_obj = room_query(room["room_name"])
        var response = await query_document(msg_index,room_obj);
       if(response.length == 0){
            //no action? 
       }else{
        //in_charge might be ""?
        var metric_obj = print_a_room(response)
        metric_obj["name"] = room["in_charge"]
        metric_obj["room"] = room["room_name"]
        //console.log(metric_obj)
        vika_total_csv_data.push(metric_obj)
       }
    }
    if(vika_total_csv_data.length > 0){ //must 
        await vika_export_customer_record(vika_total_csv_data)
        //vika_total_csv_data = []
    }else{
    console.error("NO RECORDS YET!")
    }
    //Calculate Sales Total: need sales data! 
}
//VIKA MODULE 
var vika_datasheet_id = "dstedTCmf1RnY3b6gc"
var vika_headermap =  [
  {id: 'name', title: '负责人'},
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
    //vika depends on room_db, name_db

  //ASSERT: No Duplicated data! Otherwise need to create a Created Room Dictionary, so that deuplicated rooms won't be recreated
  console.log(datas.length)
  //pull all data today, map records -> roomname; for each room in today's record, check whether it is in today. 
  //To see whether we should update or create
  var a3 = await datasheet.records.query({ 
    filterByFormula: `AND(NOT(BLANK()),IS_AFTER({上次更新时间}，TODAY()))`,
  })
  if (a3.success) {
    console.log("succeeded queried",a3.data);
  } else {
  console.error(a3);
  return;
  }
  console.log(a3)
  
  //ASSERT: no duplicate, only one room
  var all_rooms = {}
  for(var rec of a3.data.records){
    //console.log(rec)
    var key = rec["fields"]['群聊名']
    all_rooms[key] = rec
  }
  console.log(all_rooms)
  var entries = []
  var update_entries = []
  for(var data of datas){
    var roomname = data["room"]
    var key = roomname
    if(Object.keys(all_rooms).includes(key)){ //update
          var update_entry = {}
          for(let i of vika_headermap){
              update_entry[i["title"]] = data[i["id"]]
          }
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
    var metric_obj = {}
    metric_obj["over2mins"] = crit_2_mins_count
    metric_obj["avg"] = parseFloat(avg)
    metric_obj["total"] = response.length
    metric_obj["snum"] = snum
    metric_obj["emnum"] = emnum
    metric_obj["cnum"] = cnum
    metric_obj["last_replier"] = last_replier
    metric_obj["not_replied_time"] = parseFloat(not_replied_time)
    return metric_obj
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
function room_query(room_name){
    var body = {
        sort:[
          {"payload.timestamp":{"order":"asc"}}
        ],
        size:1000,
        query: {
          bool:{
            must:[
              {match: {
                "payload.roomInfo.topic.keyword":room_name
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
      return body
  }