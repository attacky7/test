const UIManager = require('UIManager');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    addClickEvent: function(node, handler, customEventData) {
        node.on(cc.Node.EventType.TOUCH_END, function(event) {
            event.stopPropagation();
            if (handler) {
                handler(node, customEventData);
            }
            if (customEventData) {
                if (!customEventData.flag) {
                    // cc.gg.audioMgr.playSFX();
                }
            } else {
                // cc.gg.audioMgr.playSFX();
            }

        });

    },

    addSlideEvent: function(node, handler, customEventData) {
        node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            event.stopPropagation();
            if (handler) {
                handler(node, event, customEventData);
            }
        });
    },

    //web模式下从远程下载并更换图片
    changeSpriteFrameWithServerUrlForWeb: function(sprite, url) {
        if (!sprite) return;
        var self = this;
        if(!sprite.nTime){
            sprite.nTime = 0
        }
        cc.loader.load({url:url,type:'jpg'}, function(err, tex2d) {
            if (err) {
                sprite.nTime++
                if(sprite.nTime<3){
                    setTimeout(function() {
                        self.changeSpriteFrameWithServerUrlForWeb(sprite, url);
                    }, 1000);
                }

            } else {
                var frame = new cc.SpriteFrame(tex2d);
                sprite.spriteFrame = frame;
            }
        });
    },

    //是否为空
    isEmpty: function(str) {
        if (str.replace(/(^s*)|(s*$)/g, "").length == 0) {
            return false;
        }
        return true;
    },

    //真实姓名验证
    isName(name) {
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        if (!regName.test(name)) {
            //alert("真实姓名填写有误");
            UIManager.Show("prefabs/", "TipsNode", function(uiNode) {
                uiNode._strText = "真实姓名填写有误";
            });
            return false;
        }
        return true;
    },

    //身份证验证
    isIdCardNum(code) {
        var city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "xinjiang",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        }
        var tip = "";
        var pass = true;

        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            tip = "身份证号格式错误";
            pass = false;
        } else if (!city[code.substr(0, 2)]) {
            tip = "地址编码错误";
            pass = false;
        } else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    tip = "校验位错误";
                    pass = false;
                }
            }
        }
        if (!pass) {
            UIManager.Show("prefabs/", "TipsNode", function(uiNode) {
                uiNode._strText = tip;
            });
        }
        return pass;
    },

    //输入框注册事件
    addEditBoxEvent: function(node, target_test, handler, customEventData) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target_test;
        eventHandler.component = target_test.__classname__;
        eventHandler.handler = handler;
        eventHandler.customEventData = customEventData;
        var clickEvents = node.getComponent(cc.EditBox).textChanged;
        clickEvents.push(eventHandler);
    },

    getSubStringLengTxt(str, strlength = 4) {
        if (str.length > strlength) {
            return str.substring(0, strlength) + ".."
        }
        return str;
    },

    //时间格式化
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    },

    ErrorLOG(roomId, strTxt) {
        // if (!cc.gg.global.logFlag) {
        //     return;
        // }
        var ret = cc.gg.userInfo
        var joinRoomData = {
            "operation": "BetTest",
            "room_id": roomId,
            "account_id": ret.account_id,
            "session": ret.session,
            "data": {
                "room_id": roomId,
                "txt": JSON.stringify(strTxt),
            }
        }
        console.log("上传数据》》", joinRoomData)
        cc.gg.net.send(joinRoomData)

    },

    //复制东西到剪切板（abc\ncba）
    webCopyString: function(str) {
        // UIManager.Show("game/public/prefabs/", "alert", function() {});
        var input = '' + str;
        const el = document.createElement('input');
        el.value = input;
        el.setAttribute('readonly', 'readonly');
        el.id = "cut";
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.width = "100px";
        el.style.height = "100px";
        el.style.left = '-9999px';
        el.style.fontSize = '18px';
        el.style.opacity = 0;
        el.setSelectionRange(0, 9999);

        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        if (document.execCommand("Copy", "false", null)) {
            success = document.execCommand('Copy');
        } else {
            prompt("您的手机不支持复制功能 请长按选择全选复制", str)
        }
        return success;
    },

    //base 64加密
    b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }))
    },

})