/*
 * 网络层基础事件
 * onclose websock断开连接
 * onerror websock连接异常
 * onopen  websock连接成功
 * onfail  5次重连超时
 *
 */
const CODE = "M4kAY0Q1MFYnTOKpV9PoA6TxEeiPX68W";
cc.Class({
    extends: cc.Component,

    ctor() {
        this.initData();
    },

    initData() {
        this.ip = "";
        this.socket = "";
        this.handlers = {}; //自定义消息事件
        this.events = {}; //自定义框架事件事件
        this.pong = 0;
        this.timeout = 0;
        this.reconnectCount = 0;
        this.cbPonging = 0; //心跳次数
    },

    removeAllEvent: function() {
        this.events = {};
    },

    removeAllHandler: function(event) {
        this.handlers = {};
    },

    // 添加基础网络消息  event--消息名  fn--消息回调函数
    addEvent: function(event, fn) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(fn);
    },

    // 添加自定义消息  event--消息名  fn--消息回调函数
    addHandler: function(event, fn) {
        if (this.handlers[event]) {
            console.log("该事件已经监听");
            return;
        }
        this.handlers[event] = fn;
    },

    // 网络连接开启，关闭，错误事件
    onmessage: function(code) {
        var array = this.events[code];
        if (array) {
            for (var i = 0; i < array.length; i++) {
                if (typeof(array[i]) == "function") {
                    array[i]();
                }
            }
        }
    },

    // 玩家掉线重连5次失败，手动重连
    reConnect: function() {
        this.connect(this.ip, false);
    },
    // 主动连接网络，如果已经有连接会先关闭老得连接
    connect: function(ip, reconnect) {

        this.ip = ip;
        var self = this;
        if (!reconnect) {
            self.reconnectCount = 0;
        } else {
            this.cbPonging = 0;
        }

        if (self.socket) {
            self.socket.close();
        }

        var newIp = self.ip;
        console.log("连接socket", newIp);
        self.socket = new WebSocket(newIp);
        self.socket.onopen = function() {
            self.reconnectCount = 0;
            if (self.reConnetTime) {
                clearInterval(self.reConnetTime);
                self.reConnetTime = undefined;
            }
            console.log("websock连接成功: ", self.ip)
            self.socket.onmessage = function(data) {
                data = data.data
                if (data == "@") {
                    self.cbPonging = 0;
                    return false;
                } else {
                    if (typeof(data) == "string") {
                        data = JSON.parse(data);
                    } else {
                        data = data;
                    }
                    cc.game.emit("GameEventMessage", data)
                }
            }
            self.socket.onclose = function(err) {
                console.log("websock断开连接", err)

                // self.onmessage("onclose");
            }
            self.socket.onerror = function(err) {
                console.log("websock连接异常", err)

                self.onmessage("onerror");
            }
            // if (!self.pong) {
            //     //心跳包
            //     // console.log("22222222222222222222222222222", self.cbPonging);
            //     self.pong = setInterval(function() {
            //         if (self.cbPonging < 2) {
            //             self.send("@");
            //             self.cbPonging++;
            //             // console.log("用户发送心跳》》》》》》》》》》》》》》》》》》》》》》》》》》！！！");
            //         } else {
            //             self.onmessage("onclose");
            //             console.log("用户断线！！！");
            //             //停止心跳定时器
            //             clearInterval(self.pong);
            //             self.pong = undefined;

            //             self.reConnetTime = setInterval(() => {
            //                 if (self.reconnectCount < 5) {
            //                     self.reconnectCount++;
            //                     self.close();
            //                     self.connect(self.ip, true)
            //                 } else {
            //                     self.onmessage("onfail");
            //                 }
            //             }, 500);
            //         }

            //     }.bind(this), 2000); //2秒一个心跳包
            // }
            self.onmessage("onopen");
        }
    },
    // 发送数据,支持json字符串和js对象结构,注意根节点必须有operation属性，代表消息号
    send: function(data) {
        var self = this;
        if (self.socket && self.socket.readyState == 1) {
            if (data != null && (typeof(data) == "object")) {
                data = JSON.stringify(data);
            }
            self.socket.send(data);
        } else {
            this.connect(this.ip);
        }
    },

    // 主动关闭网络
    close: function() {
        if (this.socket) {
            this.socket.close();
        }
    },


})