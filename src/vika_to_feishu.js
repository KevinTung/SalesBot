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
var vika_datasheet_id = "dstedTCmf1RnY3b6gc"
const datasheet = vika.datasheet(vika_datasheet_id);

//LARK PUPPET
import { PuppetLark } from 'wechaty-puppet-lark-2'
import { Feishu } from 'lark-js-sdk';
let lark = new Feishu('cli_a11cb78f1a78900b', 'v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB');
const Bot_test_group_id = "oc_f8bf4c888c663a7f3aac4ff3452bc3d4"
var alert_group = "oc_151f493e3d8b15ded4b41520a84a2739"
var sales2chat = {
    '董森': "oc_7ff99d4403ba04a6129dfb737e24739f",
    '宋宗强': "oc_df395b0182a51cec39b09f81534a09f2",
    '陈子曦': "oc_e75a4dcf83bb049b2cf8b3268d097f75",
    '冯伦': "oc_6e7e17eb110be8b22c45fa1f84a92fe1",
    '李传君': "oc_a67d0ad8d2eee6520217ba5f5ab59879",
    '吴强强': "oc_94d5b1536c35c5bb0e2474d6c5a10d69",
    '孙文博': "oc_81d4b76dae3a7bcfece6f9b45bce9a4e",
    'undefined': "oc_e297d4bc1d7e1747c995c7822e79a31f"
}
const puppet = new PuppetLark({
    larkServer: {
        port: 1235,
    },
})

puppet.start().catch(async e => {
    console.error('Bot start() fail:', e)
    // await puppet.stop()
    process.exit(-1)
})
const tolerate_time = 60 * 1000;
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
        console.log("succeeded queried", a3.data.records);
    } else {
        console.error(a3);
        return;
    }
    return a3.data.records
}
async function vika_to_feishu() {

    var vika_rooms = await get_vika_rooms() //ASSERT a3.data.total <= 1000
    vika_rooms = vika_rooms.map((e) => {
        return e.fields
    })
    console.log(vika_rooms)
    for (var vika_room of vika_rooms) {
        //ASSERT: if last replier is employee, then not_replied time == 0
        var last_replier = vika_room['最后说话者']
        var person_in_charge = vika_room['负责人']
        var room_name = vika_room['群聊名']
        var not_replied_time = vika_room['销售未回覆时间']
        var last_replier = vika_room['最后说话者']
        console.log(last_replier, person_in_charge, room_name, not_replied_time)
        //NOT REPLY Level ; how to make sure that each level is alerted only once? 
        var need_send_message = false
        var card_color
        if (5 < not_replied_time && not_replied_time < 6) {//alert at 5
            need_send_message = true
            card_color = "turquoise"
        } else if (Math.floor(not_replied_time) == 10) { //INFO: Floor operation is due to cycletime 1 mintues
            need_send_message = true
            card_color = "yellow"
        } else if (Math.floor(not_replied_time) == 20) {
            need_send_message = true
            card_color = "orange"
        } else if (Math.floor(not_replied_time) == 30) {
            need_send_message = true
            card_color = "red"
        } else if ((Math.floor(not_replied_time) % 10 == 0) && (Math.floor(not_replied_time) / 10 >= 4)) {//40-41, 50-51, ....
            need_send_message = true
            card_color = "purple"
        }else {
            need_send_message = false
        }
        if (need_send_message) {
            mycard.elements[0]["content"] = `**${last_replier}** 的消息在 **${person_in_charge}** 负责的 **${room_name}** 已经超过 **${Math.floor(not_replied_time)}** 分钟没被回复啦! 加油加油​${"⛽️"}`;
            if (room_name == undefined) {
                mycard.elements[0]["content"] += `\\n**${room} 还没有销售，请添加一位销售`
            }
            mycard.header.template = card_color
            if (not_replied_time > 20) {
                await lark.message.send({
                    chat_id: Bot_test_group_id,//alert_group,
                    msg_type: 'interactive',
                    card: mycard,
                });
            }
            await lark.message.send({
                chat_id: Bot_test_group_id,//sales2chat[person_in_charge] ,
                msg_type: 'interactive',
                card: mycard,
            });
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