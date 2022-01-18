/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
import 'dotenv/config.js'
import {
  WechatyBuilder,
  ScanStatus,
  log,
} from 'wechaty'
import {Feishu} from 'lark-js-sdk';
let lark = new Feishu('cli_a11cb78f1a78900b', 'v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB');
import qrcodeTerminal from 'qrcode-terminal'
import { Client } from "@opensearch-project/opensearch"
import { join } from 'path';

import { PuppetLark } from 'wechaty-puppet-lark-2'

import {
  //EventMessagePayload,
  MessageType,
  FileBox,
} from 'wechaty-puppet'
const puppet = new PuppetLark({
  larkServer: {
    port: 1234,
  },
})

puppet.start().catch(async e => {
  console.error('Bot start() fail:', e)
  // await puppet.stop()
  process.exit(-1)
})

async function puppet_start() {
  //const myfile = FileBox.fromFile('assets/sales_picture.png')
  const target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
  const myfile = FileBox.fromFile('assets/total_12212021.xls')
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  // await puppet.messageSendText(target_roomid, 'dong')
}
puppet_start()


//Create OpenSearch Javascript Client (borrowed from Official code) 

"use strict"; //not sure
var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin";  //For testing only. Don't store credentials in code.
var ca_certs_path = "./root-ca.pem";

// Create a client with SSL/TLS enabled.
var fs = import("fs");
var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    rejectUnauthorized: false //not authorized yet
  },
});

//put document into opensearch 
var index_name = "juzibot-sales-msg-v2-4";
var index_metric = "juzibot-sales-metric";
// var index_timer_info = "timer_info"

var doc_metric_id = 4;
// var doc_timer_info = 10; 
var juzi_corp_name = "北京句子互动科技有限公司"
async function put_document(index_name, document, id) {
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
async function query_document(index_name, query) {
  // Search for the document.
  var response = await client.search({
    index: index_name,
    body: query,
  });
  console.log("Search results:");
  console.log(response.body.hits.hits[0]);
  //console.log(response.body.hits);
}

function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user) {
  log.info('StarterBot', '%s logout', user)
}
var iii = 0;
var sales_supervisor = [
  "尹伯昊"
]
var all_sales = [
  // ,'曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超'
  '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强'
]
var alert_group = "oc_151f493e3d8b15ded4b41520a84a2739"
var sales2chat = {
  '董森':"oc_7ff99d4403ba04a6129dfb737e24739f", 
  '宋宗强':"oc_df395b0182a51cec39b09f81534a09f2", 
  '陈子曦':"oc_e75a4dcf83bb049b2cf8b3268d097f75", 
  '冯伦':"oc_6e7e17eb110be8b22c45fa1f84a92fe1", 
  '李传君':"oc_a67d0ad8d2eee6520217ba5f5ab59879", 
  '吴强强':"oc_94d5b1536c35c5bb0e2474d6c5a10d69"
}

var timer_set_count = 0;
var timer_cancel_count = 0;
var timeout_count = 0;
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

const target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
const BBIWY_group_id = "oc_a1f098656192c592e21aae7175219d46"
//ASSERT: for any group with sales-bot, there is one sales. 
async function onMessage(msg) { 
  log.info('StarterBot', msg.toString());
  console.log("MSG:",msg.toString())
  msg._payload.fromInfo = rename_payload(msg.from());

var room_sales
var room_name


  var value;
  console.log("MSG1")
  if (msg.room() == null) { //from individual or group? 
    console.log("MSG2")
    msg._payload.roomInfo = {};
    msg._payload.toInfo = rename_payload(msg.to());
    room_name = msg.from().name()
  } else {
    console.log("MSG3")
    room_name = await msg.room().topic();
    //search for the sales
    if(all_sales.includes(msg.from().name())){
      room_sales = msg.from().name()
    }else{//search for the only room_sales
      //console.log("given customer room, search sales")
      var search_sales
      var searched = false
      var memberList = await msg.room().memberAll(); //Contact[]
      for (var i = 0; i < memberList.length; i++) {
        //console.log("membername\n" + memberList[i].name())
        if(all_sales.includes(memberList[i].name())){
          search_sales = memberList[i].name()
          searched = true
          break
        }
      }
      console.log("sales is ",search_sales)
      room_sales = search_sales
    }

    value = await client.get({
      id: doc_metric_id,
      index: index_metric
    })

    //console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
    var source = value.body._source;
    var data = value.body._source.data;
    //data['曹啸']['role']="sales"
    log.info('StarterBot', value);
    //take namelist of sales and customer, if there isn't create a new one (sales to customer : one to many)
    if (!Object.keys(data).includes(room_sales)) {//if room_sales is not recorded in the 1st layer in metric, init this sales
      data[room_sales] = { 'all_rooms': {} };
        data[room_sales]["rooms_count"] = 0;
        source["names_count"] += 1;
        console.log('new sales');
        data[room_sales]['role'] = "sales"
      // if (all_sales.includes(msg.from().name())) {
      //   data[msg.from().name()] = { 'all_rooms': {} };
      //   data[msg.from().name()]["rooms_count"] = 0;
      //   source["names_count"] += 1;
      //   //assign role
      //   // if(all_sales.includes(msg.from().name())){ 
      //   console.log('new sales');
      //   data[msg.from().name()]['role'] = "sales"
      //   // }
      //   // else if (msg._payload.fromInfo.corporation == juzi_corp_name){
      //   //     console.log('new name: role:employee ');
      //   //     data[msg.from().name()]['role'] = "employee";
      //   // }else{
      //   //   //assert this role is customer
      //   //   console.log('new name: role:customer ');
      //   //   data[msg.from().name()]['role'] = "customer";
      //   // }
      // }
      // else if (msg._payload.fromInfo.corporation == juzi_corp_name) {
      //   console.log('new name: role:employee, not recorded ');
      //   //data[msg.from().name()]['role'] = "employee";
      // } else {
      //   //assert this role is customer
      //   console.log('new name: role:customer, not recorded ');
      //   //data[msg.from().name()]['role'] = "customer";
      // }
    } else {
      console.log('old sales');
    }

    //now, assert the name is successfully created; check whether is a sale and the room is new
    if (!Object.keys(data[room_sales]['all_rooms']).includes(room_name))
        //|| !("customers" in data[msg.from().name()]['all_rooms'][room_name]) //make sure it is the new version 
    {
      console.log('new room')
      data[room_sales]['all_rooms'][room_name] = {};
      var name = msg.from().name();
      data[room_sales]['all_rooms'][room_name]["sales"] = {}
      data[room_sales]['all_rooms'][room_name]["sales"] = { [[name]]: {} } //don't know if name is correct 
      data[room_sales]['all_rooms'][room_name]["employee"] = {}
      data[room_sales]['all_rooms'][room_name]["customers"] = {}
      source["rooms_count"] += 1;
      data[room_sales]["rooms_count"] += 1;

      //deal with all people , get customer  ; need to test 
      var memberList = await msg.room().memberAll(); //Contact[]
      for (var i = 0; i < memberList.length; i++) {
        console.log("membername\n" + memberList[i].name())
        var memcorp = await memberList[i].corporation();
        if (memcorp === juzi_corp_name) {
          console.log("employee:" + memberList[i].name());
          data[room_sales]['all_rooms'][room_name]["employee"][memberList[i].name()] = {};
        } else {
          console.log("new customer:" + memberList[i].name());
          data[room_sales]['all_rooms'][room_name]["customers"][memberList[i].name()] = {};
        }
      }
    // } else if (all_sales.includes(msg.from().name())) { //still need to be sales
    //   console.log('old room, still update customer...')
    //   var name = msg.from().name();
    //   //if("finished_update" in data[msg.from().name()]['all_rooms'][room_name]){
    //   var version_num = 1;
    //   if (data[msg.from().name()]['all_rooms'][room_name]["finished_update"] === version_num) {
    //     console.log("finished update!!!")
    //   } else {
    //     //
    //     data[msg.from().name()]['all_rooms'][room_name]["sales"] = { [[name]]: {} }
    //     data[msg.from().name()]['all_rooms'][room_name]["employee"] = {}
    //     //check all members 
    //     var memberList = await msg.room().memberAll(); //Contact[]
    //     for (var i = 0; i < memberList.length; i++) {
    //       console.log("membername\n" + memberList[i].name())
    //       //remove sales from customers 
    //       if (all_sales.includes(memberList[i].name())) {
    //         delete data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()]
    //       }
    //       //remove employees from customers; add employee to employee
    //       var memcorp = await memberList[i].corporation();
    //       if (memcorp === juzi_corp_name) {
    //         console.log("employee:" + memberList[i].name());
    //         data[msg.from().name()]['all_rooms'][room_name]["employee"][memberList[i].name()] = {};
    //         delete data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()]
    //       } else if (!all_sales.includes(name)) { //add customer again; need to avoid special developers 
    //         console.log("new customer:" + memberList[i].name());
    //         data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()] = {};
    //       }
    //     }
    //     data[msg.from().name()]['all_rooms'][room_name]["finished_update"] = 1;
    //   }
    } else {
      console.log("old room: ",room_name,"sales: ",room_sales);
    }
    //put the new index back
    // put_document(index_metric,value.body._source, doc_metric_id);

    msg._payload.toInfo = {};
    var new_room = rename_payload(msg.room());
    var s = await msg.room().topic();
    log.info('StarterBot', "topic is:\n" + s);
    new_room.topic = s;
    log.info('StarterBot', 'roominfo:\n' + JSON.stringify(new_room));
    msg._payload.roomInfo = new_room;
  }

  //SECTION:TIMER
  //if msg from customers, set timer, need to reply in t seconds 
  var memcorp = await msg.from().corporation();
  //if(memcorp !== juzi_corp_name &&!all_sales.includes(msg.from().name()) ){
  var tolerate_time = 600*1000.0;
  
  //room_or_name = "句子互动 维诺娜&句客宝"

  var room_obj = data[room_sales]['all_rooms'][room_name]
  var commands = ["cancel"]
  if ((memcorp !== juzi_corp_name) && !commands.includes(msg._payload.text)) { //not employee, i.e. customer
    //if timer is off, then start timer, else no actions
    console.log("customer request!!")
    console.log(room_obj)

    if (!Object.keys(room_obj).includes("timerID")) { //init
      console.log("init data structure!!")
      room_obj["timerID"] = "" //need to make sure data type is right
      //room_obj["timerAlive"] = false;
      room_obj["timer_timestamp"] = 0
    }
    var timer_timestamp = new Date(room_obj["timer_timestamp"]) //maintain the init time of last timer
    var current_time = new Date(msg._payload.timestamp)
    console.log("current timer, last timer:", current_time, timer_timestamp)
    if (current_time - timer_timestamp > tolerate_time) { //timer must be dead. can init new timer
      console.log("timerAlive false, new timer!!")
      let mytimer = setTimeout(() => {
        //msg.say('超过'+ (tolerate_time/1000).toString()+'秒没回');  
        var s = "【" + msg.from().name() + "】的消息在【"+room_sales + "】负责的【" + room_name + "】快超过" + ((tolerate_time / 1000 / 60).toFixed(2).toString()) + "分钟没被回复了！[Thinking]";
        mycard.elements[0]["content"] = `**${msg.from().name()}** 的消息在 **${room_sales}** 负责的 **${room_name}** 就快超过 **${((tolerate_time / 1000 / 60).toFixed(2).toString()) }** 分钟没被回复啦! 加油加油​${"⛽️"}`;
        lark.message.send({
          chat_id: alert_group ,
          msg_type: 'interactive',
          card:mycard,
        });
        lark.message.send({
          chat_id: sales2chat[room_sales] ,
          msg_type: 'interactive',
          card:mycard,
        });
        // puppet.messageSendText(alert_group, s);
        // puppet.messageSendText(sales2chat[room_sales], s);
        timeout_count += 1;
      }, tolerate_time);

      room_obj["timerID"] = mytimer[Symbol.toPrimitive]()
      room_obj["timer_timestamp"] = msg._payload.timestamp
      timer_set_count += 1;
    }
    console.log("AFTER:", room_obj)

  } else { //employee
    console.log("employee reply!")
    console.log("BEFORE:", room_obj)
    var timer_timestamp = new Date(room_obj["timer_timestamp"]) //maintain the init time of last timer
    var current_time = new Date(msg._payload.timestamp)
    console.log("current timer, last timer:", current_time, timer_timestamp)
    if (current_time - timer_timestamp < tolerate_time) { //if timer is on, then turn off timer
      clearTimeout(room_obj["timerID"])
      timer_cancel_count += 1
    }
    console.log("AFTER:", room_obj)
  }
  //console.log("CHECK_AFTER",data[room_sales]['all_rooms'])

  console.log("timer set, cancel, timeout count:", timer_set_count, " ", timer_cancel_count, " ", timeout_count)
  put_document(index_metric, value.body._source, doc_metric_id);
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  //save msg in OpenSearch
  var new_msg = rename_payload(msg);
  log.info('StarterBot', 'after\n' + JSON.stringify(new_msg));
  put_document(index_name, JSON.stringify(new_msg), new_msg.id); //id in ES and in wechat is the same 
  log.info('StarterBot', iii.toString()); iii++; //counter

}

function rename_payload(obj) {
  //ASSERT obj has _payload field 
  var new_obj = JSON.parse(JSON.stringify(obj));
  new_obj.payload = JSON.parse(JSON.stringify(obj._payload));
  delete new_obj._payload;
  return new_obj;
}
const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-padlocal' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-padlocal`)
   *
   * You can use the following providers:
   *  - wechaty-puppet-wechat (no token required)
   *  - wechaty-puppet-padlocal (token required)
   *  - wechaty-puppet-service (token required, see: <https://wechaty.js.org/docs/puppet-services>)
   *  - etc. see: <https://github.com/wechaty/wechaty-puppet/wiki/Directory>
   */
  // puppet: 'wechaty-puppet-wechat',
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
  .then(async () => {
    log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch(e => {
    log.error('StarterBot', e)
    process.exit(55)
  })


process.on('uncaughtException', err => {
  console.error(err && err.stack)
  mycard.elements[0]["content"] = `系統要掛掉了QQ`;
  lark.message.send({
    chat_id:  target_roomid,
    msg_type: 'interactive',
    card:mycard,
  });
  lark.message.send({
    chat_id:  target_roomid,
    msg_type: 'text',
    content: {text:err && err.stack},
  });
  process.exit(55)
});