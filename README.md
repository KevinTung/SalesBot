# Readme


## About the Project 
For a toB company to sale its enterprise service, the sales need to communicate with the potential customers effectively.  As each sales are overloaded with customers, they are prone to delayed response and low-quality response.  To evaluate the conversation between sales and customers requires huge labor works from manager and HRs.  Therefore, a sales-assistant chatbot to record, analyze, and visualize the metrics of the conversation comes in handy. 

![Flowchart](https://github.com/KevinTung/sales-assistant/blob/main/assets/Flowchart.jpg)

## Getting Started 
### Prerequisites
- [tmux](https://github.com/tmux/tmux/wiki)
- [docker](https://www.docker.com/)
- [nodejs](https://nodejs.org/en/)

### Installation

```
git clone https://github.com/KevinTung/sales-assistant.git
npm install 
```

### Usage 

- Edit the `config/default.json` file
- Use [tmux](https://tmuxcheatsheet.com/) to run multiple processes in a single terminal

```
tmux a   #to open a new window
Ctrl+B D #detach from tmux window
Ctrl+B W #switch between windows
Ctrl+D   #close a window
```

- Run the 3 undockerized programs in separate tmux terminals: 

```
NODE_CONFIG_DIR=./config node src/vika-to-feishu.js 
NODE_CONFIG_DIR=./config node src/vika-update-roomdb.js
NODE_CONFIG_DIR=./config node update-vika.js
```

- Run the dockerized salesbot service

```shell
./scripts/modify_code_and_run.sh
```


## Contact 
KevinTung - [@asd135441](https://twitter.com/asd135541) - email@example.com


