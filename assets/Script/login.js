const URL = "https://www.block-game.top"//"https://www.guochandmlt.cn"

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initMain()

        this.nodeDict = {};

        var linkWidget = function(self, nodeDict) {
            var children = self.children;
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName) {
                    var nodeName = widgetName //.substring(4);
                    if (nodeDict[nodeName]) {
                        cc.log("控件名字重复!" + children[i].name);
                    }
                    nodeDict[nodeName] = children[i];
                }
                if (children[i].childrenCount > 0) {
                    linkWidget(children[i], nodeDict);
                }
            }
        }.bind(this);
        linkWidget(this.node, this.nodeDict);
    },

    onEnable() {

    },

    start() {
        cc.gg.utils.addClickEvent(this.nodeDict["button"], this.onBtnClick.bind(this));
    },


    onClose() {

    },

    initMain() {


        cc.gg = {}

        //清楚小游戏未被使用的缓存资源
        // remoteDownloader.cleanOldCaches()

        var Utils = require("Utils")
        cc.gg.utils = new Utils()

        var AudioMgr = require("AudioMgr")
        cc.gg.audioMgr = new AudioMgr()
        cc.gg.audioMgr.init()

        cc.gg.http = require("HTTP")
            // cc.gg.http = new HTTP()

        var Socket = require("Socket")
        cc.gg.net = new Socket()

        var UIManager = require('UIManager');
        UIManager.Init();




        var Weixin = require("Weixin")
        cc.gg.wx = new Weixin();
        cc.gg.wx.config()

    },

    onBtnClick(event) {
        var name = event.name;
        if (name == 'button') {
            // 授权登录
            var id = 1
            if(this.nodeDict["boxID"].getComponent(cc.EditBox).string&&this.nodeDict["boxID"].getComponent(cc.EditBox).string!=""){
                id = this.nodeDict["boxID"].getComponent(cc.EditBox).string
            }

            if(cc.gg.auth && cc.gg.auth.uid && this.isWeiXin()){
                id = cc.gg.auth.uid
                console.log("进来没有？？？", id)
            }
            
            cc.gg.http.sendRequestGet(URL+"/login/test?id=", id, (ret) => {
                cc.log(ret);
                if(ret.status == 0){
                    cc.gg.auth = ret.auth
                    cc.gg.net.connect(ret.data.gateway)

                    if(cc.gg.wxInfo && (cc.gg.wxInfo.nick_name != ret.data.info.nick_name || cc.gg.wxInfo.avatarUrl != ret.data.info.head_img)){

                        console.log("post请求：：：：：：：：：")
                        cc.gg.http.sendRequestPost('/register', {
                            auth: cc.gg.auth,
                            nick_name:cc.gg.wxInfo.nickName,
                            head_img:cc.gg.wxInfo.avatarUrl
                        }, function(ret) {
                            console.log("提交信息：")
                            cc.gg.userInfo = ret.data
                            cc.director.loadScene("hall", function() {})
                        })
                    }
                    else{
                        
                        cc.gg.userInfo = ret.data.info
                        cc.director.loadScene("hall", function() {})

                        // //测试信息
                        // cc.gg.http.sendRequestPost('/register', {
                        //     auth: cc.gg.auth,
                        //     nick_name:"zhang",
                        //     head_img:"url::::::::"
                        // }, function(ret) {
                        //     console.log("提交信息：")
                        //     cc.gg.userInfo = ret.data
                        //     cc.director.loadScene("hall", function() {})
                        // })
                    }


                }

            })

        }
    },

    isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
    
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }

})


// export default URL