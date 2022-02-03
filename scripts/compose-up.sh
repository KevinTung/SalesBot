# Color variables
red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
blue='\033[0;34m'
magenta='\033[0;35m'
cyan='\033[0;36m'
# Clear the color after that
clear='\033[0m'


echo -e "${green}Building Image..${clear}"
docker build -t salesbot .
echo -e "${blue}Stopping Salesbot Container..${clear}"
docker stop salesbot
echo -e "${yellow}Starting Container..${clear}"
docker run \
    -d \
    --name=salesbot-temp \
    -e TZ=Asia/Shanghai \
    -e WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT=true \
    -e WECHATY_LOG=error \
    -e WECHATY_PUPPET=wechaty-puppet-service \
    -e WECHATY_PUPPET_SERVICE_TOKEN=puppet_wxwork_5b06054f9a660733 \
    -e WECHATY_PUPPET_LARK_APPID=cli_a11cb78f1a78900b \
    -e WECHATY_PUPPET_LARK_APPSECRET=v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB \
    -e WECHATY_PUPPET_LARK_TOKEN=0spElzY3Z89Dbz5u2hL0Xf6cjDGptTrZ \
    --network=host \
    --restart=always \
    salesbot
echo -e "${red}Removing Salesbot Container..${clear}"
docker rm salesbot
echo -e "${magenta}Renaming Salesbot Container..${clear}"
docker rename salesbot-temp salesbot