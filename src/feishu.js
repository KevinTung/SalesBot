import {Feishu} from 'lark-js-sdk';
//LARK PUPPET
import { PuppetLark } from 'wechaty-puppet-lark-2'

import {
  //EventMessagePayload,
  MessageType,
  FileBox,
}                           from 'wechaty-puppet'
const puppet = new PuppetLark({
  larkServer: {
    port: 1236,
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


var file_body = {
    'file_type':"xls",
    'file_name':'total_Tue, Dec 21, 2021total.csv'
}

const BBIWY_group_id = "oc_a1f098656192c592e21aae7175219d46"
const bot_test_group_id = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"


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
    "template": "red",
    "title": {
      "content": "超时警报",
      "tag": "plain_text"
    }
  }
}
async function sendMessage() {
  let lark = new Feishu('cli_a11cb78f1a78900b', 'v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB');

    let {groups} = await lark.bot.group.getList();
   console.log(groups)
  let chatIds = groups.map(group => group.chat_id);
  
  // for(var i in sales2chat){
    // let {message_id} = await lark.message.send({
    //     chat_id: alert_group ,
    //     msg_type: 'text',
    //     content: {text: '现在我改成10分钟提醒一次噢～'},
    //   });
    // console.log(`Message (${message_id}) sent!`);

  //   mycard.elements[0]["content"] = `**${"Mr.wang"}** 的消息在 **${"董森"}** 负责的 **${"句子互动服务群-魔力猫盒"}** 超过 **${10.00}** 分钟没被回复了! ​${"🧐"}`;
  //   let {message_id} = await lark.message.send({
  //     chat_id: bot_test_group_id ,
  //     msg_type: 'interactive',
  //     card:mycard,
  //   });
  // console.log(`Message (${message_id}) sent!`);
  // }


  for (let chatId of chatIds) {
    // console.log(chatId)
    // let {message_id} = await lark.message.send({
    //   chat_id: chatId,
    //   msg_type: 'text',
    //   content: {text: 'Hello, Lark!'},
    // });

    //console.log(`Message (${message_id}) sent!`);
  }
}
sendMessage();
// var vv = await puppet.roomList()
// for(var i in vv){
//   console.log("VVI:",vv[i])
//   var tt = await puppet.roomMemberList(vv[i]["chat_id"])
//   console.log("TT:",tt)
// }
var all_sales = [
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

var openids = ["ou_0f9275a03912ea9a1df52d9f13902ec1","ou_69332016ab8dc36da17dad017a273712"]
// console.log(vv)
let lark = new Feishu('cli_a11cb78f1a78900b', 'v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB');
// var x = "ou_70f5fc9073aaf6cfb7571242aa88d863"
// let {groups} = await lark.bot.group.getList();
// lark.contact.user.getInfos('employee_ids', ["ou_70f5fc9073aaf6cfb7571242aa88d863"]).then(data=>{
//   console.log(data)
// })

// for(var i in openids){
// await lark.message.send(
//   {
//     open_id:openids[i],
//     msg_type: 'text',
//     content: {
//       text: "hii"
//     }
//   }
// );
// }

// lark.contact.user
//   .add({
//     name: '童子铨',
//     mobile: '13141367789',
//     department_ids: ['od-234355343342acdbef33'],
//     need_send_notification: true,
//   })
//   .then(data => {
//     let {user_info} = data;

//     console.log('User added:', user_info);
//   });


// const myfile = FileBox.fromFile('download.png')
//     await puppet.messageSendFile(msgPayload.fromId!, myfile).catch(console.error)


// import lark from "@larksuiteoapi/allcore";

// // Configuration of custom app, parameter description:
// // appID、appSecret: "Developer Console" -> "Credentials"（App ID、App Secret）
// // verificationToken、encryptKey："Developer Console" -> "Event Subscriptions"（Verification Token、Encrypt Key）
// // helpDeskID、helpDeskToken, Help Desk token：https://open.feishu.cn/document/ukTMukTMukTM/ugDOyYjL4gjM24CO4IjN
// const appSettings = lark.newInternalAppSettings({
//     appID: "cli_a11cb78f1a78900b",
//     appSecret: "v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB",
// })

// // Currently, you are visiting larksuite, which uses default storage and default log (error level). For more optional configurations, see readme.md -> How to Build an overall Configuration (Config).
// const conf = lark.newConfig(lark.Domain.FeiShu, appSettings, {
//     loggerLevel: lark.LoggerLevel.ERROR,
// })

// // The content of the sent message
// const body = {
//     chat_id: 'oc_f8bf4c888c663a7f3aac4ff3452bc3d4',
//     msg_type: 'text',
//     content: {text: 'Hello, Lark!'},
// }
// const file_body = {
//     file_type: 'xls',
//     file_name: '1.xls',
//     duration: 3000,
//     file:"all_output/total_Tue, Dec 21, 2021total.xls"
// }
// var req_body = file_body
// // Build request

// //var appi = "/open-apis/im/v1/files"
//  var appi = "/open-apis/message/v4/send"
// const req = lark.api.newRequest(appi, "POST", lark.api.AccessTokenType.Tenant, req_body)
// // Send request 
// lark.api.sendRequest(conf, req).then(r => {
//     // Print the requestId of the request
//     console.log(r.getRequestID())
//     // Print the response status of the request
//     console.log(r.getHTTPStatusCode())
//     console.log(r) // r = response.body
// }).catch(e => {
//     // Error handling of request
//     console.log(e)
// })

// const myfile = FileBox.fromFile('download.png')
// await puppet.messageSendFile(msgPayload.fromId!, myfile).catch(console.error)



// async messageSendFile (conversationId: string, file: FileBox): Promise<string | void> {
//     const _mimeType = file.mimeType ? file.mimeType : ''
//     if (/image/i.test(_mimeType)) {
//       const token = await this.getTenantAccessToken(this.appId, this.appSecret)
//       const imageKey = await this.uploadImage(token, file)
//       const response = await axios({
//         data:
//         {
//           chat_id: conversationId,
//           content: {
//             image_key: imageKey,
//           },
//           msg_type: 'image',
//         },
//         headers: {
//           Authorization: 'Bearer ' + token,
//           'Content-Type': 'application/json',
//         },
//         method: 'POST',
//         url: 'https://open.feishu.cn/open-apis/message/v4/send/',
//       })
//       if (response.data.code === '0') {
//         log.verbose('PuppetLark', 'messageSendFile', 'Successfully send image.')
//       } else {
//         log.error('Failed to send image:', response.data.msg)
//       }
//     }
//   }


// private async uploadImage (_token: string, image: FileBox): Promise<string> {
//     const _image = await image.toStream()
//     const formData = new FormData()
//     formData.append('image', _image)
//     formData.append('image_type', 'message')
//     const boundary = await formData.getBoundary()
//     const response = await axios({
//       data: formData,
//       headers: {
//         Authorization: 'Bearer ' + _token,
//         'Content-Type': 'multipart/form-data;boundary=' + boundary,
//       },
//       method: 'POST',
//       url: 'https://open.feishu.cn/open-apis/image/v4/put/',
//     })
//     if (response.data.code === 0) {
//       return response.data.data.image_key
//     } else {
//       return ''
//     }
//   }

// private async getTenantAccessToken (appId: string, appSecret: string): Promise<string> {
//     const response = await axios({
//       data:
//       {
//         app_id: appId,
//         app_secret: appSecret,
//       },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/',
//     })
//     const tenantAccessToken = response.data.tenant_access_token
//     return tenantAccessToken
//   }


// async function uploadImage(imageType: 'message' | 'avatar', image: any) {
//   let tenant_access_token = await this.client.getTenantAccessToken();

//   let formData = new FormData();

//   formData.append('image_type', imageType);
//   formData.append('image', image);

//   return this.client.postFormData<DataResponse<MessageUploadImageData>>(
//     'image/v4/put/',
//     formData,
//     tenant_access_token,
//   );
// }
  