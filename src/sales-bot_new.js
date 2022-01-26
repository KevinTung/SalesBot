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
import { Feishu } from 'lark-js-sdk';
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
    port: 1237,
  },
})

const target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
const BBIWY_group_id = "oc_a1f098656192c592e21aae7175219d46"

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
var juzi_corp_name = "北京句子互动科技有限公司"
var name_index = "juzibot-sales-name";
var name_index_doc_id = 1
var room_index = "juzibot-sales-room-2";
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
//TEST:  individuals; group: create new room, get old room; 
//ASSERT: for any group with sales-bot, there is one sales. 
async function onMessage(msg) {
  log.info('StarterBot', msg.toString());
  console.log("MSG:", msg.toString())
  msg._payload.fromInfo = rename_payload(msg.from());

  var room_name
  if (msg.room() == null) { //Not a group
    msg._payload.roomInfo = {};
    msg._payload.toInfo = rename_payload(msg.to());
    room_name = msg.from().name()
  } else {
    room_name = await msg.room().topic();
    var rooms = await get_a_room(room_index, room_name)
    if (rooms.length > 1) { // > 1 ,
      console.log("ROOM EXCEED 1! total rooms:", rooms.length)
    } else if (rooms.length == 0) {
      // ASSERT: the sales and after_sales is correct in the name_index
      // Create New Room
      // search for ROLES: sales, after_sales, employees 
      // Assert sales phase is presales

      var room_obj = {}
      var sales_list = await get_all_names(2)
      var after_sales_list = await get_all_names(3)
      console.log("NAMES:", sales_list, after_sales_list)

      var searched_sales = []
      var searched_after_sales = []
      var employees = []
      var memberList = await msg.room().memberAll(); //Contact[]
      for (var i = 0; i < memberList.length; i++) {
        var j = memberList[i].name()
        var memcorp = await memberList[i].corporation();
        if (memcorp === juzi_corp_name) {
          if (sales_list.includes(j)) {
            searched_sales.push(j)
          }
          if (after_sales_list.includes(j)) {
            searched_after_sales.push(j)
          }
          employees.push(j)
        }
      }

      room_obj["sales"] = searched_sales
      room_obj["after_sales"] = searched_after_sales
      room_obj["employee"] = employees
      room_obj["room_name"] = room_name
      room_obj["phase"] = "pre-sales"
      if (searched_sales.length > 0) {
        room_obj["in_charge"] = searched_sales[0]
      }else{
        room_obj["in_charge"] = ""
      }
      console.log("New Room:", room_obj)
      var response = await client.index({
        index: room_index,
        body: room_obj,
        refresh: true,
      });
      console.log("Adding document:");
      console.log(response.body);
    }
  }
  //save msg in OpenSearch
  var new_msg = rename_payload(msg);
  log.info('StarterBot', 'after\n' + JSON.stringify(new_msg));
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
// get_a_room(room_index,"句子互动服务群-位来小猎")
async function get_a_room(room_index, room_name) {
  var qq = {
    size: 1000,
    query: {
      match: {
        "room_name.keyword": room_name
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

async function get_all_names(option) {
  //1:all,2:sales,3:post_sales
  var value = await client.get({
    id: name_index_doc_id,
    index: name_index
  })
  var source = value.body._source
  if (option == 1) {
    return Object.keys(source)
  } else if (option == 2) {
    var r = []
    Object.keys(source).forEach((e) => {
      if (source[e]['role'] === "sales") r.push(e)
    })
    return r
  } else if (option == 3) {
    var r = []
    Object.keys(source).forEach((e) => {
      if (source[e]['role'] === "after_sales") r.push(e)
    })
    return r
  }
}


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
      "content": "",
      "tag": "plain_text"
    }
  }
}

process.on('uncaughtException', err => {
  console.error(err && err.stack)
  mycard.elements[0]["content"] = `系統要掛掉了QQ`;
  lark.message.send({
    chat_id: target_roomid,
    msg_type: 'interactive',
    card: mycard,
  });
  lark.message.send({
    chat_id: target_roomid,
    msg_type: 'text',
    content: { text: err && err.stack },
  });
  process.exit(55)
});