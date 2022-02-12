scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
echo $scriptDir
if [ -f $scriptDir/.env ]; then
    # Load Environment Variables
    export $(cat $scriptDir/.env | grep -v '#' | awk '/=/ {print $1}')
    echo "Loaded environmental variable: WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT=$WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT"
    echo "Loaded environmental variable: WECHATY_LOG=$WECHATY_LOG"
    echo "Loaded environmental variable: WECHATY_PUPPET=$WECHATY_PUPPET"
    echo "Loaded environmental variable: WECHATY_PUPPET_SERVICE_TOKEN=$WECHATY_PUPPET_SERVICE_TOKEN"
    echo "Loaded environmental variable: TZ=$TZ"
    
    docker run \
    -d \
    --name=salesbot \
    -e TZ=$TZ \
    -e WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT=$WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT \
    -e WECHATY_LOG=$WECHATY_LOG \
    -e WECHATY_PUPPET=$WECHATY_PUPPET \
    -e WECHATY_PUPPET_SERVICE_TOKEN=$WECHATY_PUPPET_SERVICE_TOKEN \
    --network=host \
    --restart=always \
    salesbot
    docker run \
        -d \
        --name=update-vika \
        --network=host \
        --restart=always \
        -e NODE_CONFIG_DIR=./config \
        salesbot \
        node src/update-vika.js
    docker run \
        -d \
        --name=vika-update-roomdb \
        --network=host \
        --restart=always \
        -e NODE_CONFIG_DIR=./config \
        salesbot \
        node src/vika-update-roomdb.js
    docker run \
        -d \
        --name=vika-to-feishu \
        --network=host \
        --restart=always \
        -e NODE_CONFIG_DIR=./config \
        salesbot \
        node src/vika-to-feishu.js
fi
