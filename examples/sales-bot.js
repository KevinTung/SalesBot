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
import qrcodeTerminal from 'qrcode-terminal'
import { Client } from "@opensearch-project/opensearch"
import { join } from 'path';

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
var index_metric = "juzibot-sales-metric-test";
var doc_metric_id = 2;
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
var all_sales = [
  // '童子铨','曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超'
  '曾璐','董森','宋宗强','曹啸','陈子曦','冯伦','韩祥宇','尹伯昊','李传君','李添','刘珉','孙文博','陶好',
  '田野','吴强强','王生良'
]


var index_metric = "juzibot-sales-metric";
async function onMessage(msg) {
  log.info('StarterBot', msg.toString());
  
  msg._payload.fromInfo = rename_payload(msg.from());

  //all_sales.includes(msg.from().name())
  
  
    // client.get({//改掉，改成await
    //   id: 2,
    //   index: "juzibot-sales-metric"
    // }).then(function(value) {  //在銷售主動發消息時開始錄入
    //   //console.log("before_final\n"+JSON.stringify(value.body._source,null,4));
    //     //console.log(JSON.stringify(value.body._source,null,4));
    //     //value.body._source.all_sales["童子铨"].customer1["criteria:later-than-3-seconds"].count +=1;
    //     //take namelist of sales and customer, if there isn't create a new one (sales to customer : one to many)
    //     if(!Object.keys(value.body._source).includes(msg.from().name())){//create one name 
    //       console.log('new name');
    //       value.body._source[msg.from().name()]={'all_rooms':[]}; 
    //     }
    //     //assert the name is successfully created
      
    //     if(!Object.keys(value.body._source[msg.from().name()]['all_rooms']).includes(room_name)){
    //       console.log('new room')
    //       value.body._source[msg.from().name()]['all_rooms'].push({[room_name]:{}});
    //     }
        
    //     console.log("final\n"+JSON.stringify(value.body._source,null,4));
    //  });
  
  if (msg.room() == null) {
    msg._payload.roomInfo = {};
    msg._payload.toInfo = rename_payload(msg.to());
  } else {
    var room_name = await msg.room().topic();
    var value = await client.get({
      id: doc_metric_id,
      index: index_metric
    })

    //console.log("first retrieve metric\n"+JSON.stringify(value.body._source,null,4));
    var source = value.body._source ;
    var data = value.body._source.data ;
   //data['曹啸']['role']="sales"
    log.info('StarterBot', value);
      //take namelist of sales and customer, if there isn't create a new one (sales to customer : one to many)
      if(!Object.keys(data).includes(msg.from().name()) ){//if not recorded, and is sale: create new name 
        if(all_sales.includes(msg.from().name())){
        
          data[msg.from().name()]={'all_rooms':{}}; 
          data[msg.from().name()]["rooms_count"]=0;
          source["names_count"]+=1; 
          //assign role
          // if(all_sales.includes(msg.from().name())){ 
          console.log('new name: role:sale');
          data[msg.from().name()]['role'] = "sales"
          // }
          // else if (msg._payload.fromInfo.corporation == juzi_corp_name){
          //     console.log('new name: role:employee ');
          //     data[msg.from().name()]['role'] = "employee";
          // }else{
          //   //assert this role is customer
          //   console.log('new name: role:customer ');
          //   data[msg.from().name()]['role'] = "customer";
          // }
        }
        else if (msg._payload.fromInfo.corporation == juzi_corp_name){
            console.log('new name: role:employee, not recorded ');
            //data[msg.from().name()]['role'] = "employee";
        }else{
          //assert this role is customer
          console.log('new name: role:customer, not recorded ');
          //data[msg.from().name()]['role'] = "customer";
        }
      }else{
        console.log('old name');
      }

      //now, assert the name is successfully created; check whether is a sale and the room is new
      if(all_sales.includes(msg.from().name()) && 
        (  
          !Object.keys(data[msg.from().name()]['all_rooms']).includes(room_name) 
          //|| !("customers" in data[msg.from().name()]['all_rooms'][room_name]) //make sure it is the new version 
        )
      ){
        console.log('new room')
        data[msg.from().name()]['all_rooms'][room_name]={};
        var name = msg.from().name(); 
        data[msg.from().name()]['all_rooms'][room_name]["sales"] = {}
        data[msg.from().name()]['all_rooms'][room_name]["sales"]= {[[name]]:{}} //don't know if name is correct 
        data[msg.from().name()]['all_rooms'][room_name]["employee"] = {}
        data[msg.from().name()]['all_rooms'][room_name]["customers"] = {}
        source["rooms_count"]+=1; 
        data[msg.from().name()]["rooms_count"] +=1; 
        
        //deal with all people , get customer  ; need to test 
        var memberList = await msg.room().memberAll(); //Contact[]
        for(var i=0; i<memberList.length;i++){
          console.log("membername\n"+memberList[i].name())
          var memcorp = await memberList[i].corporation();
          if (memcorp === juzi_corp_name){
            console.log("employee:"+memberList[i].name());
            data[msg.from().name()]['all_rooms'][room_name]["employee"][memberList[i].name()]={};
          }else{ 
            console.log("new customer:"+memberList[i].name());
            data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()]={};
          }
        }
      }else if (all_sales.includes(msg.from().name())){ //still need to be sales
        console.log('old room, still update customer...')
        var name = msg.from().name(); 
        //if("finished_update" in data[msg.from().name()]['all_rooms'][room_name]){
        var version_num = 1;
        if(data[msg.from().name()]['all_rooms'][room_name]["finished_update"]===version_num){
          console.log("finished update!!!")
        }else{
          //
          data[msg.from().name()]['all_rooms'][room_name]["sales"] = {[[name]]:{}}
          data[msg.from().name()]['all_rooms'][room_name]["employee"] = {}
          //check all members 
          var memberList = await msg.room().memberAll(); //Contact[]
          for(var i=0; i<memberList.length;i++){
            console.log("membername\n"+memberList[i].name())
            //remove sales from customers 
            if(all_sales.includes(memberList[i].name())){
              delete data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()]
            }
            //remove employees from customers; add employee to employee
            var memcorp = await memberList[i].corporation();
            if (memcorp === juzi_corp_name){
              console.log("employee:"+memberList[i].name());
              data[msg.from().name()]['all_rooms'][room_name]["employee"][memberList[i].name()]={};
              delete data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()] 
            }else if(!all_sales.includes(name)){ //add customer again; need to avoid special developers 
              console.log("new customer:"+memberList[i].name());
              data[msg.from().name()]['all_rooms'][room_name]["customers"][memberList[i].name()]={};
            }
          }
          data[msg.from().name()]['all_rooms'][room_name]["finished_update"] = 1; 
        }
      }
      //put the new index back
      //console.log("final\n"+JSON.stringify(value.body._source,null,4));
      put_document(index_metric,value.body._source,doc_metric_id);

    msg._payload.toInfo = {};
    var new_room = rename_payload(msg.room());
    var s = await msg.room().topic(); 
    log.info('StarterBot',"topic is:\n"+ s);
    new_room.topic = s;
    log.info('StarterBot','roominfo:\n'+JSON.stringify(new_room));
    msg._payload.roomInfo = new_room;
  }

  //if msg from customers, set timer, need to reply in t seconds 
  var memcorp = await msg.from().corporation();
  //if(memcorp !== juzi_corp_name &&!all_sales.includes(msg.from().name()) ){
  var tolerate_time = 2000;
  if(msg.from().name()=='童子铨'){
    setTimeout(() => {  msg.say('超过'+ (tolerate_time/1000).toString()+'秒没回');   }, tolerate_time);
  }



  var new_msg = rename_payload(msg);
  log.info('StarterBot','after\n'+JSON.stringify(new_msg));
  put_document(index_name, JSON.stringify(new_msg), new_msg.id); //id in ES and in wechat is the same 
  log.info('StarterBot', iii.toString()); iii++; //counter



  //timer section
  // if(
  //   //new_msg.payload.fromInfo.payload.corporation=='北京句子互动科技有限公司' && 
  //   new_msg.payload.fromInfo.payload.name=='童子铨'){
  //   setTimeout(() => {  msg.say('dingdingding');   }, 1000);
  // }
  
}

function rename_payload(obj){
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
    // await bot.logout()
  })
  .catch(e => log.error('StarterBot', e))
