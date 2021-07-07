WebSocketClient = require('websocket').client;
TursomMsg = require("./TursomMsg_pb")

function isEmptyStr(str) {
    if (str === null) return true
    if (typeof str != 'string') return false
    return str === 'null' || str === undefined || str === 'undefined' || str.match(/^[\s]*$/);
}

function removeUndefined(obj) {
    Object.keys(obj).forEach((key) => {
        const element = obj[key];
        if (element == null || isEmptyStr(element)) {
            delete obj[key]
        }

        if (element != null && typeof element != 'string') {
            removeUndefined(element)
        }
    })
    return obj
}

TursomMsg.ImMsg.prototype.toSimpleObject = function () {
    return removeUndefined(this.toObject())
}

const client = new WebSocketClient();

client.on("connect", function (connection) {
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'binary') {
            msg = TursomMsg.ImMsg.deserializeBinary(message.binaryData)
            console.log("ws >>> " + JSON.stringify(msg.toSimpleObject()));
            switch (msg.getContentCase()) {
                case TursomMsg.ImMsg.ContentCase.LOGINRESULT:
                    connection.close()
            }
        }
    });

    function sendHeartbeat() {
        if (connection.connected) {
            let msg = new TursomMsg.ImMsg()
            msg.setHeartbeat("heartbeat")
            connection.sendBytes(Buffer.from(msg.serializeBinary()))
            setTimeout(sendHeartbeat, 30000);
        }
    }

    sendHeartbeat();

    let loginMsg = new TursomMsg.ImMsg()
        .setLoginrequest(new TursomMsg.LoginRequest()
            // .setToken("CNeb25i9srXUchILMjFiNjg2YUIzejY="))
            .setToken("CNmX3Zb/m+HAYRILMjF0c2ZkMXJRNU4="))
    connection.sendBytes(Buffer.from(loginMsg.serializeBinary()))
    setTimeout(sendHeartbeat, 30000);
})

client.connect("ws://127.0.0.1:12345/ws")

// console.log(Object.keys(TursomMsg.ImMsg))
// let msg = new TursomMsg.ImMsg()
// msg.setSelfmsg(true)
// msg.setMsgid("msg id")
//     .setChatmsg(new TursomMsg.ChatMsg()
//         .setReceiver("hello"))
// console.log(msg);
// console.log(JSON.stringify(msg.toSimpleObject()));
// console.log(msg.serializeBinary());