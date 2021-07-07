var jspb = require('google-protobuf');

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

console.log(TursomMsg.ImMsg.prototype)
console.log(TursomMsg.ImMsg.ContentCase)
// console.log(Object.keys(TursomMsg.ImMsg))
msg = new TursomMsg.ImMsg()
msg.setSelfmsg(true)
msg.setMsgid("msg id")
    .setChatmsg(new TursomMsg.ChatMsg()
        .setReceiver("hello"))
console.log(msg.toSimpleObject());