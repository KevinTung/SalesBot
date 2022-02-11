# Readme


## About the Project 
For a company to sale its enterprise service, the sales need to communicate with the potential customers effectively.  As each sales are overloaded with customers, they are prone to delayed response and low-quality response.  To evaluate the conversation between sales and customers requires huge labor works from manager and HRs.  Therefore, a sales-assistant chatbot to record, analyze, and visualize the metrics of the conversation comes in handy. 

![Flowchart](https://github.com/KevinTung/sales-assistant/blob/main/assets/Flowchart.jpg)

## [總體配置流程](https://k0auuqcihb.feishu.cn/docs/doccnKLFrlLJ7kcJIZHDdUhhWGx#GOFlKz)
```
【管理者】執行【產品準備1】和【產品準備2】，得到【售前售後名單, 企業名稱，警報配置，2個Vika表單的ID】
【技術人員】根據【售前售後名單, 企業名稱，警報配置，2個Vika表單的ID】執行【部署系統】，使系統上線，通知【管理者】，正式運行
【管理者、售前、售後】平時按照【產品使用流程】使用產品
【技術人員】平時按照【技術使用流程】使用項目
```
## [部署系統](https://k0auuqcihb.feishu.cn/docs/doccnKLFrlLJ7kcJIZHDdUhhWGx#GeHWT6)
```
【技術人員】根據【售前售後名單, 企業名稱，警報配置，2個Vika表單的ID】执行【部署系統】{
    config 指的是 sales-assistant/config/default.json 文件
    env 指的是 sales-assistant/config/.env 文件
    確認已經【創建飛書銷售機器人】
    #產品配置
    0. 將名單填入 config 的 names.sales, names.after_sales_
    1. 根據名單，透過【某段代碼】，取得群聊名稱，填入 config 的 lark.channels, lark.sales2chat
    2. 根據警報配置，配置config 的 lark.salesAlert, afterSalesAlert
    3. 根據企業名稱，配置config 的 corp.name
    4. 【辦Vika帳號】，將vika的帳號ID填入vika.token, 將2個vika表單的ID（今日群聊、群聊總表）填入vika.todayRoom, vika.allRooms
    
    #技術配置
    配置服務器、git clone項目，npm install，安裝docker
    執行【部署OpenSearch】取得並配置 config 的 dbConfig,index.msg,index.room,index.name
    配置 env 的 DOCKER_NAME,TZ,WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT,WECHATY_LOG,WECHATY_PUPPET,WECHATY_PUPPET_SERVICE_TOKEN
    執行 ./scripts/modify_code_and_run.sh
    執行【名單註冊】：
        NODE_CONFIG_DIR=./config node src/update-name.js
    開啟三個tmux窗口，分別執行：
        NODE_CONFIG_DIR=./config node src/vika-to-feishu.js 
        NODE_CONFIG_DIR=./config node src/vika-update-roomdb.js
        NODE_CONFIG_DIR=./config node src/update-vika.js
 
    配置 timeZone，這將決定【Vika今日群聊表單】的時間範圍
    配置 UpdateCycleTime，這將決定【Vika表單，數據庫，飛書推送】的更新頻率(微秒），默認是一分鐘(60000)
    
    檢驗：透過 docker logs -f salesbot 確認salesbot運行順利，在三個tmux窗口內確認三份代碼運行順利
    返回【總配置流程】
}
```

## [部署 OpenSearch](https://k0auuqcihb.feishu.cn/docs/doccnKLFrlLJ7kcJIZHDdUhhWGx#Coq5ne)
```
【技術人員】在【服務器】上【部署OpenSearch】{
    1. 在 opensearch目錄下，執行 docker-compose up 
    2. 讓 OpenSearch跑在9200端口，並讓OpenSearch DashBoard跑在5601端口，得到【localhost,protocol,port,auth】
    3. 下載 OpenSearch Js SDK , 跑通 Sample Code
    4. 創建三個索引：msg,room,name,得到【三個 index】
    返回【localhost,protocol,port,auth，三個 index】到【部署系統】
}
```


## [配置 Configuration](https://k0auuqcihb.feishu.cn/docs/doccnKLFrlLJ7kcJIZHDdUhhWGx#WW8HVI) 

## [使用流程](https://k0auuqcihb.feishu.cn/docs/doccnKLFrlLJ7kcJIZHDdUhhWGx#7D4yYM) 




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


