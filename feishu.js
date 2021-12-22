// import {Feishu} from 'lark-js-sdk';


// var file_body = {
//     'file_type':"xls",
//     'file_name':'total_Tue, Dec 21, 2021total.csv'
// }


// async function sendMessage() {
//   let lark = new Feishu('cli_a11cb78f1a78900b', 'v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB');

//     let {groups} = await lark.bot.group.getList();

//   let chatIds = groups.map(group => group.chat_id);
  
//   let {message_id} = await lark.message.send({
//       chat_id: "oc_f8bf4c888c663a7f3aac4ff3452bc3d4",
//       msg_type: 'text',
//       content: {text: 'I am gonna rule the world hhhhhhhh'},
//     });
//  console.log(`Message (${message_id}) sent!`);

//   for (let chatId of chatIds) {
//      console.log(chatId)
//     // let {message_id} = await lark.message.send({
//     //   chat_id: chatId,
//     //   msg_type: 'text',
//     //   content: {text: 'Hello, Lark!'},
//     // });

//     //console.log(`Message (${message_id}) sent!`);
//   }
// }

//sendMessage();

import lark from "@larksuiteoapi/allcore";

// Configuration of custom app, parameter description:
// appID、appSecret: "Developer Console" -> "Credentials"（App ID、App Secret）
// verificationToken、encryptKey："Developer Console" -> "Event Subscriptions"（Verification Token、Encrypt Key）
// helpDeskID、helpDeskToken, Help Desk token：https://open.feishu.cn/document/ukTMukTMukTM/ugDOyYjL4gjM24CO4IjN
const appSettings = lark.newInternalAppSettings({
    appID: "cli_a11cb78f1a78900b",
    appSecret: "v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB",
})

// Currently, you are visiting larksuite, which uses default storage and default log (error level). For more optional configurations, see readme.md -> How to Build an overall Configuration (Config).
const conf = lark.newConfig(lark.Domain.FeiShu, appSettings, {
    loggerLevel: lark.LoggerLevel.ERROR,
})

// The content of the sent message
const body = {
    chat_id: 'oc_f8bf4c888c663a7f3aac4ff3452bc3d4',
    msg_type: 'text',
    content: {text: 'Hello, Lark!'},
}
const file_body = {
    file_type: 'xls',
    file_name: '1.xls',
    duration: 3000,
    file:"all_output/total_Tue, Dec 21, 2021total.xls"
}
var req_body = file_body
// Build request

var appi = "/open-apis/im/v1/files"
// var appi = "/open-apis/message/v4/send"
const req = lark.api.newRequest(appi, "POST", lark.api.AccessTokenType.Tenant, req_body)
// Send request 
lark.api.sendRequest(conf, req).then(r => {
    // Print the requestId of the request
    console.log(r.getRequestID())
    // Print the response status of the request
    console.log(r.getHTTPStatusCode())
    console.log(r) // r = response.body
}).catch(e => {
    // Error handling of request
    console.log(e)
})





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
  