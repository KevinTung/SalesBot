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
   '童子铨', '董森', '宋宗强', '陈子曦', '冯伦', '李传君', '吴强强','孙文博','undefined'
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
   if (msg.room() == null) { //from individual or group? 
    //not create room?  
     msg._payload.roomInfo = {};
     msg._payload.toInfo = rename_payload(msg.to());
     room_name = msg.from().name()
   } else {
     room_name = await msg.room().topic();
    //TODO:query room from db,get sales or post_sales
    //if no room, Create New One
    //if has room, see its responsible sales or post_sales -> get responsible_person; status?

    //Create New Room (sales phase)
    //search sales
    var search_sales
    var searched = false
    var memberList = await msg.room().memberAll(); //Contact[]
    for (var i = 0; i < memberList.length; i++) {
        if(all_sales.includes(memberList[i].name())){
        search_sales = memberList[i].name()
        searched = true
        break
        }
    }
    console.log("sales is ",search_sales)
    room_sales = search_sales
     
 
     value = await client.get({
       id: doc_metric_id,
       index: index_metric
     })
 
     var source = value.body._source;
     var data = value.body._source.data;
     log.info('StarterBot', value);
     //take namelist of sales and customer, if there isn't create a new one (sales to customer : one to many)
     if (!Object.keys(data).includes(room_sales)) {//if room_sales is not recorded in the 1st layer in metric, init this sales
       data[room_sales] = { 'all_rooms': {} };
         data[room_sales]["rooms_count"] = 0;
         source["names_count"] += 1;
         console.log('new sales');
         data[room_sales]['role'] = "sales"
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
    
     } else {
       console.log("old room: ",room_name,"sales: ",room_sales);
     }
     msg._payload.toInfo = {};
     var new_room = rename_payload(msg.room());
     new_room.topic = room_name;
     log.info('StarterBot', "topic is:\n" + s);
     log.info('StarterBot', 'roominfo:\n' + JSON.stringify(new_room));
     msg._payload.roomInfo = new_room;
   }
 
   //save metric data
   put_document(index_metric, value.body._source, doc_metric_id);
   //save msg in OpenSearch
   var new_msg = rename_payload(msg);
   log.info('StarterBot', 'after\n' + JSON.stringify(new_msg));
   log.info('StarterBot', iii.toString()); iii++; //counter
   put_document(index_name, JSON.stringify(new_msg), new_msg.id); //id in ES and in wechat is the same 
 
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