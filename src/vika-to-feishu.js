import config from 'config';
const config_all = config.get('All');

import { Vika } from "@vikadata/vika";
const vika = new Vika({ token: config_all.vika.token, fieldKey: "name" });
var vika_datasheet_id = config_all.vika.datasheetId
const datasheet = vika.datasheet(vika_datasheet_id);

//LARK PUPPET
import { PuppetLark } from 'wechaty-puppet-lark-2'
import { Feishu } from 'lark-js-sdk';

let lark = new Feishu(config_all.lark.appId, config_all.lark.appKey);
const cycle_time = config_all.lark.cycle_time
const tolerate_time = config_all.updateCycleTime.vika2Feishu
var sales2chat = config_all.lark.sales2chat
var channels = config_all.lark.channels
var sales_alert = config_all.lark.salesAlert
var after_sales_alert = config_all.lark.afterSalesAlert
var alert_group = config_all.lark.channels.alert_group
// var alert_group = "oc_151f493e3d8b15ded4b41520a84a2739"
// var sales2chat = {
//     '董森': "oc_7ff99d4403ba04a6129dfb737e24739f",
//     '宋宗强': "oc_df395b0182a51cec39b09f81534a09f2",
//     '陈子曦': "oc_e75a4dcf83bb049b2cf8b3268d097f75",
//     '冯伦': "oc_6e7e17eb110be8b22c45fa1f84a92fe1",
//     '李传君': "oc_a67d0ad8d2eee6520217ba5f5ab59879",
//     '吴强强': "oc_94d5b1536c35c5bb0e2474d6c5a10d69",
//     '孙文博': "oc_81d4b76dae3a7bcfece6f9b45bce9a4e",
//     'undefined': "oc_e297d4bc1d7e1747c995c7822e79a31f",
//     '闫小娟': "oc_3e00b519456ce83688aa9490d98026b8",
//     '曹啸':"oc_756d240baba47a3ffea38ca2e15eb047",
//     '田荣生':"oc_4fde254e065e267b28fc5b95e728cf37",
// }
const puppet = new PuppetLark({
    larkServer: {
        port: config_all.lark.serverPort,
    },
})

puppet.start().catch(async e => {
    console.error('Bot start() fail:', e)
    // await puppet.stop()
    process.exit(-1)
})

async function puppet_start() {
    console.log("HIIII")
    vika_to_feishu()
    let timerID = setInterval(() => {
        vika_to_feishu()
    }, tolerate_time);
}
async function get_vika_rooms() { //LIMIT: update only 1000 rooms, if a3.data.total > 1000, need to move to next page until no results
    var a3 = await datasheet.records.query({
        filterByFormula: `AND(NOT(BLANK()),IS_AFTER({上次更新时间}，TODAY()))`,
        pageSize: 1000
    })
    if (a3.success) {
        console.log("succeeded queried");
    } else {
        console.error(a3);
        return;
    }
    return a3.data.records
}
async function vika_to_feishu() {

    var vika_rooms = await get_vika_rooms() //ASSERT a3.data.total <= 1000
    if(vika_rooms==undefined){
        console.log("get_vika_rooms FAILED")
        return
    }
    vika_rooms = vika_rooms.map((e) => {
        return e.fields
    })

    // console.log(color_level[y.toString()])
    // return
    
    for (var vika_room of vika_rooms) {
        //ASSERT: if last replier is employee, then not_replied time == 0
        var last_replier = vika_room['最后说话者']
        var person_in_charge = vika_room['负责人']
        var room_name = vika_room['群聊名']
        var not_replied_time = vika_room['负责人未回覆时间（分钟）']
        var last_replier = vika_room['最后说话者']
        var phase = vika_room['群聊阶段']
        console.log(last_replier, person_in_charge, room_name, not_replied_time)
        //NOT REPLY Level ; how to make sure that each level is alerted only once? 
        
        var card_color
        not_replied_time = Math.floor(not_replied_time)
        var need_send_message = false
        not_replied_time = 11
        var alert
        
        //distinguish btw sales and after sales's config
        if(phase === 'pre-sales'){
            alert = sales_alert
        }else if(phase==='after-sales'){
            alert = after_sales_alert
        }
       
        const color_level = alert.color_level
        
        var time_list = Object.keys(color_level).map((e)=>{return parseInt(e)}).filter((e)=>{return !isNaN(e)})
        
        if(time_list.includes(not_replied_time)){
            need_send_message = true
            card_color = color_level[not_replied_time.toString()] 
        }else{
            var last_time = time_list[time_list.length-1]
            console.log(not_replied_time,last_time,alert.cycle_time)
            if((not_replied_time-last_time)%alert.cycle_time===0 && not_replied_time<=alert.until){
                need_send_message = true
                console.log("ER")
                card_color = color_level["above"]
            }
        }
        
        if (need_send_message) {
            mycard.elements[0]["content"] = `**${last_replier}** 的消息在 **${person_in_charge}** 负责的 **${room_name}** 已经超过 **${Math.floor(not_replied_time)}** 分钟没被回复啦! 加油加油​${"⛽️"}`;
            if (room_name == undefined) {
                mycard.elements[0]["content"] += `\\n**${room} 还没有销售，请添加一位销售`
            }
            mycard.header.template = card_color
            if (not_replied_time > alert.group_alert_threshold) {
                await lark.message.send({
                    chat_id: channels.target_roomid,// alert_group,
                    msg_type: 'interactive',
                    card: mycard,
                });
            }
            // await lark.message.send({
            //     chat_id: channels.target_roomid,//sales2chat[person_in_charge] ,
            //     msg_type: 'interactive',
            //     card: mycard,
            // });
        }
        
    }

}


var mycard = {
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
process.on('uncaughtException', err => {
    console.error(err && err.stack)
});