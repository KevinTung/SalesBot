// 如果不能使用 es6 import，可用 const Vika = require('@vikadata/vika').default; 代替
import { Vika } from "@vikadata/vika";

const vika = new Vika({ token: "uskFCOzapV3u5AcryXEpG1U", fieldKey: "name" });
// 通过 datasheetId 来指定要从哪张维格表操作数据。
const datasheet = vika.datasheet("dstedTCmf1RnY3b6gc");



var headermap =  [
{id: 'name', title: "﻿销售名"},
{id: 'room', title: '群聊名'},
{id: 'over2mins', title: '回复超过2分钟次数'},
{id: 'avg', title: '平均回复时间（分钟）'},
{id: 'total', title: '总回复数'},
{id: 'snum', title: '销售总回复数'},
{id: 'emnum', title: '其他员工总回复数'},
{id: 'cnum', title: '顾客总回复数'},
]
var title_list = []
for(let i of headermap){
    title_list.push(i["title"])
}


var data = {
    name: "asd",
    room: "asd",
    over2mins: 123,
    avg: 123,
    total:123,
    snum:23,
    emnum:23,
    cnum:45,
}


is_new_day("小壳")
async function is_new_day(roomname){ //if find the room created today, then update
    
const room2record = await datasheet.records.query({
    //viewId: 'viwxxxxx',
    filterByFormula: '{群聊名} = "'+roomname+'"'
    //filterByFormula: '{日期} = "'+todayy+'"'
  })
  
  try {
    if (room2record.success) {
        for(var record of room2record.data.records){        
            console.log(record)
            const offset_in_ms = 1000 * 60 * 60 * 8
            var today = new Date()
            var d = new Date(record.fields["日期"])
            console.log(d,today,isToday(d,today))
            today = new Date(today.getTime()+offset_in_ms)
            d = new Date(d.getTime()+offset_in_ms)
            console.log(d,today,isToday(d,today))
        }

        var todayy = new Date()
        const a3 = await datasheet.records.query({ 
            filterByFormula: 'AND('+'{群聊名} = "'+roomname+'"'+',IS_AFTER({'+"日期"+'},TODAY()))'
          })
        console.log(a3.data.records)


    }
  } catch (error) {
  console.log(error)
  }
}

var options = { year: 'numeric', month: 'short', day: 'numeric' };
var date_string = new Date(Date.now()).toLocaleDateString("en-US", options);
// console.log(date_string)

function isToday(someDate,today){
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

function vika_export_customer_record(datas){
    var entries = []
    var update_entries = []
    for(var data of datas){
       var roomname = data['群聊名']
       const a3 = await datasheet.records.query({ 
        filterByFormula: 'AND('+'{群聊名} = "'+roomname+'"'+',IS_AFTER({'+"日期"+'},TODAY()))'
      })
      if(a3.data.records.length > 0){ //update
        if(a3.data.records.length == 1){
            var update_entry = {}
            for(let i of headermap){
                update_entry[i["title"]] = data[i["id"]]
            }
            console.log("create:",update_entry)
            console.log("record id:",a3.data.records[0][recordId])
            update_entries.push({recordId: a3.data.records[0][recordId],"fields":update_entry})
        }else{//not normal
            console.log('error',a3.data.records)
        }
      }else{ //create
        var entry = {}
        for(let i of headermap){
            entry[i["title"]] = data[i["id"]]
        }
        console.log("update:",entry)
        entries.push({"fields":entry})
    }   
    }
    console.log("CREATE:",entries)
    datasheet.records.create(
    entries
    ).then(response => {
        if (response.success) {
        console.log(response.data);
        } else {
        console.error(response);
        }
    })
    console.log("UPDATE:",update_entries)
    datasheet.records.update(
    entries
    ).then(response => {
        if (response.success) {
        console.log(response.data);
        } else {
        console.error(response);
        }
    })
}