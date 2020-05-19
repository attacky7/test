var GameMessage = ["GameEventMessage"]

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

        this.onEvenHandle()
    },

    onEnable() {
        cc.gg.utils.addClickEvent(this.nodeDict["bt_pay"], this.onBtnClick.bind(this));

        cc.gg.utils.addClickEvent(this.nodeDict["mode1"], this.onBtnClick.bind(this));
        cc.gg.utils.addClickEvent(this.nodeDict["mode2"], this.onBtnClick.bind(this));

        cc.gg.utils.addClickEvent(this.nodeDict["bt_close"], this.onBtnClick.bind(this));
    },

    start() {
        
        this.nodeDict["vip"].active = false
        this.nodeDict["lab_id"].getComponent(cc.Label).string = "ID:"+cc.gg.userInfo.username
        this.nodeDict["lab_gold"].getComponent(cc.Label).string = "铜钱"+cc.gg.userInfo.score
    },


    onClose() {

    },

    onBtnClick(event) {
        var name = event.name;
        console.log("button_name:", name)
        if (name == 'bt_pay') {
            // 充值
        } else if (name == 'mode1') {
            
            this.sendGameList(1)
                
        } else if (name == 'mode2') {

            this.sendGameList(2)

        } else if (name == 'bt_close') {

            cc.director.loadScene("hall", function() {})
        }
    },

    sendGameList(mode){

        var data = {
            "option": "start",
            "auth": cc.gg.auth,
            "data": {
                "mode": mode
            }
        }

        cc.gg.net.send(data)
    },

    //处理事件
    onEvenHandle() {

        for (var i = 0; i < GameMessage.length; i++) {
            cc.game.on(GameMessage[i], dataInfo => {
                this.onEvenGameScene(dataInfo.option, dataInfo)
            });
        }
    },

    onEvenGameScene(option, data){
        console.log(option, data)
        if(data.status == 0){
            if(option == "start"){

            }else if(option == "found"){

                cc.director.loadScene("game_rect", function() {})

            }else if(option == "not_found"){

                
            }
        }else{
            console.log(data.message)
        }

    },

});