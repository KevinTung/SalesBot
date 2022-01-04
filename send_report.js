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




import { PuppetLark } from 'wechaty-puppet-lark-2'

import {
  //EventMessagePayload,
  MessageType,
  FileBox,
}                           from 'wechaty-puppet'
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

async function puppet_start(){
  //const myfile = FileBox.fromFile('assets/sales_picture.png')
  const target_roomid = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
  const myfile = FileBox.fromFile('assets/total_12212021.xls')
  //await puppet.messageSendXLSFile(target_roomid, myfile,'total_12212021.xls').catch(console.error)
  var tolerate_time = 2000;
     // if(msg.from().name()=='童子铨'){
     setInterval(() => {  
       puppet.messageSendText(target_roomid, '超过'+ (tolerate_time/1000).toString()+'秒没回')  
     }, tolerate_time);
     // }
 // await puppet.messageSendText(target_roomid, 'dong')

}
puppet_start()