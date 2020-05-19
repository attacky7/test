// var httpUrl = "47.112.141.229" //"120.78.209.199" //"47.112.119.108" //"47.112.141.229"; //测试服
// var URL = null;
// //非APP
// if (!(cc && cc.sys.isNative)) {
//     //window.location.login   //这个为空时读取本地 httpUrl，真机环境下读取配置表的url
//     if (!window.location.login) {
//         window.location.login = httpUrl;
//     }
//     URL = "http://" + window.location.login + "/";
// } else {
//     //APP
//     URL = "http://" + httpUrl + "/";
// }
var URL = "https://www.block-game.top"//"https://www.guochandmlt.cn"

var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        master_url: null,
        url: URL,
        sendRequestPost: function(path, data, handler, extraUrl) {
            if (data.isChangeData === false) {
                var isChangeData = data.isChangeData;
                delete data.isChangeData;
            }
            var self = this;
            if (!handler.count) {
                handler.count = 1;
            } else {
                handler.count++;
            }
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 3000;

            if (extraUrl == null) {
                extraUrl = HTTP.url;
            }
            var requestURL = extraUrl + path;
            xhr.open("POST", requestURL, true);
            if (isChangeData === false) {
                xhr.setRequestHeader("Content-Type", "application/json");
            } else {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    console.log("<<http res(" + xhr.responseText.length + "):《 " + path + " 》" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        // console.log("返回数据》》",ret)
                        if (handler !== null) {
                            if (ret.result == -100) {
                                alert('你以被拉入黑名单');
                                return false
                            } else {
                                handler(ret);
                            }
                        }
                        /* code */
                    } catch (e) {
                        if (handler.count < 3) {
                            if (isChangeData !== undefined) {
                                data.isChangeData = isChangeData;
                            }
                            self.sendRequestPost(path, data, handler, extraUrl);
                        }
                        console.log("err:" + e);
                    } finally {

                    }
                } else if (xhr.status != 200) {
                    if (handler.count < 3) {
                        if (isChangeData !== undefined) {
                            data.isChangeData = isChangeData;
                        }
                        self.sendRequestPost(path, data, handler, extraUrl);
                    } else {

                    }
                }
            };
            if (isChangeData === false) {
                delete data.deviceToken;
                delete data.platform;
                xhr.send(JSON.stringify(data));
                console.log(JSON.stringify(data));
            } else {
                xhr.send(JSON.stringify(data));
            }
            return xhr;
        },


        sendRequestGet: function(baseAddr, roomNumber, handler) {

            if (!roomNumber || Array.isArray(roomNumber)) {
                alert("GET请求问题！！！", roomNumber);
                return;
            }

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;

            var path = baseAddr + roomNumber;
            console.log("RequestURL:" + path);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if (handler !== null) {
                            handler(ret);
                        }
                    } catch (e) {
                        console.log("catch:" + e);
                    } finally {
                        console.log("finally");
                    }
                } else {
                    console.log("请求数据失败：：：：：状态：" + xhr.readyState);
                }
            };

            xhr.open("GET", path, true);
            xhr.send();
            return xhr;
        },

    },
});