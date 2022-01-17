docker run \
    -d \
    --name=salesbot \
    -e TZ=Asia/Shanghai \
    -e WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT=true \
    -e WECHATY_LOG=verbose \
    -e WECHATY_PUPPET=wechaty-puppet-service \
    -e WECHATY_PUPPET_SERVICE_TOKEN=puppet_wxwork_5b06054f9a660733 \
    -e WECHATY_PUPPET_LARK_APPID=cli_a11cb78f1a78900b \
    -e WECHATY_PUPPET_LARK_APPSECRET=v8EDxzVdkIipoEaIVtrqfgUoCWsrB1vB \
    -e WECHATY_PUPPET_LARK_TOKEN=0spElzY3Z89Dbz5u2hL0Xf6cjDGptTrZ \
    --network=host \
    --restart=always \
    salesbot

