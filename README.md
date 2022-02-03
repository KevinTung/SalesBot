# Readme


## About the Project 
For a company to sale its enterprise service, the sales need to communicate with the potential customers effectively.  As each sales are overloaded with customers, they are prone to delayed response and low-quality response.  To evaluate the conversation between sales and customers requires huge labor works from manager and HRs.  Therefore, a sales-assistant chatbot to record, analyze, and visualize the metrics of the conversation comes in handy. 

![Flowchart](https://github.com/KevinTung/sales-assistant/blob/main/assets/Flowchart.jpg)

## Prerequisites
- [tmux](https://github.com/tmux/tmux/wiki)
- [docker](https://www.docker.com/)
- [nodejs](https://nodejs.org/en/)
- [opensearch](https://opensearch.org/downloads.html)

## Installation

```
git clone https://github.com/KevinTung/sales-assistant.git
npm install 
```

## Configuration

```json
{
  "All":{
    "dbConfig": { //Opensearch Configuration
      "host": "localhost",
      "protocol":"https",
      "port": 9200,
      "auth": "admin:admin"
    },
    "index":{
      "msg": "juzibot-sales-msg-v2-4", //for wechat message
      "room": "juzibot-sales-room-2",
      "name": {
        "index":"juzibot-sales-name",
        "docId": 1,
        "backup":10
        }
    },
    "corp":{
      "name":"北京句子互动科技有限公司"
    },

    "vika":{
      "token":"uskFCOzapV3u5AcryXEpG1U",
      "datasheetId":"dstedTCmf1RnY3b6gc",
      "updateTime":60000
    },
    
    "names":{
      "sales":[
        "sales1_name",
        "sales2_name",
      ],
      "after_sales":[
        "after_sales1_name",
        "after_sales2_name",
      ]
    },
    "lark":{
      "appId":"",
      "appKey":"",
      "sales2chat":{  //every sales need to have 1 individual room
        "sales1_name": "oc_xxxx", 
        "sales2_name": "oc_xxxx",
      },
      "channels":{ // create more rooms as you like
        "target_roomid":"oc_xxxx",
        "BBIWY_group_id":"oc_xxxx",
        "alert_group":"oc_xxxx"
      },
      "serverPort":1235
    }
  } 
}
```


## Usage 

- Edit the `config/default.json` file
- Run the dockerized `salesbot` service

```shell
./scripts/modify_code_and_run.sh
```

- Run the 3 undockerized programs in separate tmux terminals: 

```
NODE_CONFIG_DIR=./config node src/vika-to-feishu.js 
NODE_CONFIG_DIR=./config node src/vika-update-roomdb.js
NODE_CONFIG_DIR=./config node update-vika.js
```

- To update sales list, modify `config.All.names` and run

```
NODE_CONFIG_DIR=./config node src/update-name.js 
```

## Appendix
- Use [tmux](https://tmuxcheatsheet.com/) to run multiple processes in a single terminal

```
tmux a   #to open a new window
Ctrl+B D #detach from tmux window
Ctrl+B W #switch between windows
Ctrl+D   #close a window
```


## Contact 
KevinTung - [@asd135441](https://twitter.com/asd135541) - email@example.com


