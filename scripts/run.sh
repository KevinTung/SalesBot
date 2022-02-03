if [ -f .env ]; then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
    docker run \
        -d \
        --name=$DOCKER_NAME \
        -e TZ=$TZ \
        -e WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT=$WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT \
        -e WECHATY_LOG=$WECHATY_LOG \
        -e WECHATY_PUPPET=$WECHATY_PUPPET \
        -e WECHATY_PUPPET_SERVICE_TOKEN=$WECHATY_PUPPET_SERVICE_TOKEN \
        --network=host \
        --restart=always \
        salesbot
fi

