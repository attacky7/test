var GameMessage = ["GameEventMessage"]

const UIManager = require('UIManager')

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

        this._rectData = this.node.getComponent("rectData");

        this.nodeDict = {};

        var linkWidget = function(self, nodeDict) {
            var children = self.children;
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName) {
                    var nodeName = widgetName //.substring(4);
                    if (nodeDict[nodeName]) {
                        // cc.error("控件名字重复!" + children[i].name);
                    }else{
                        nodeDict[nodeName] = children[i];
                    }
                }
                if (children[i].childrenCount > 0) {
                    linkWidget(children[i], nodeDict);
                }
            }
        }.bind(this);
        linkWidget(this.node, this.nodeDict);

        var children = this.nodeDict["s_game"].children
        for(var i=0; i<children.length; i++){
            children[i].active = true
            for(var j=0; j<children[i].children; j++){
                children[i].children[j].active = false
            }
        }

        var children = this.nodeDict["o_game"].children
        for(var i=0; i<children.length; i++){
            children[i].active = true
            for(var j=0; j<children[i].children; j++){
                children[i].children[j].active = false
            }
        }

        //适配
        this.node.scaleY = cc.winSize.height/720

        this.onEvenHandle()
    },

    onEnable() {

        cc.gg.utils.addClickEvent(this.nodeDict["bt_stop"], this.onBtnClick.bind(this));
        cc.gg.utils.addClickEvent(this.nodeDict["bt_left"], this.onBtnClick.bind(this));
        cc.gg.utils.addClickEvent(this.nodeDict["bt_right"], this.onBtnClick.bind(this));
        cc.gg.utils.addClickEvent(this.nodeDict["bt_bottom"], this.onBtnClick.bind(this));
        cc.gg.utils.addClickEvent(this.nodeDict["bt_resh"], this.onBtnClick.bind(this));
        cc.gg.utils.addClickEvent(this.nodeDict["right_bottom"], this.onBtnClick.bind(this));
        
    },

    start() {
        this.nodeDict["lab_score"].getComponent(cc.Label).string = 0 
        this.nodeDict["other_id"].getComponent(cc.Label).string = "ID:"
    },


    onClose() {

    },

    onBtnClick(event) {
        var name = event.name;
        if (name == 'bt_stop') {
            this.sendUserFail()
        }else if(name == 'bt_left'){
            this.sendUserOption(1)
        }else if(name == 'bt_right'){
            this.sendUserOption(2)
        }else if(name == 'bt_bottom'){
            this.sendUserOption(3)
        }else if(name == 'bt_resh'){
            this.sendUserOption(4)
        }else if(name == 'right_bottom'){

        }
    },

    //1左2右3下,4旋转
    sendUserOption(reverse){

        var option = "left"
        if(reverse==1){
            option = "left"
        }else if(reverse==2){
            option = "right"
        }else if(reverse==3){
            option = "down"
        }else if(reverse==4){
            option = "trun"
        }

        var data = {
            "option": "play",
            "auth": cc.gg.auth,
            "data": option
        }

        cc.gg.net.send(data)
    },

    sendUserFail(){

        var data = {
            "option": "defeat",
            "auth": cc.gg.auth,
            "data": ""
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
            if(option == "step"){
                this.setGameView(data.data.canvas, data.data.score)
            }else if(option == "did_step"){
                this.setOtherGameView(data.data.canvas)
            }else if(option == "game_over"){
                this.setGameEnd(data.data)
            }
        }else{
            console.log(data.message)
        }

    },

    setGameView(data, score){

        if(!this.nodeDict || !this.nodeDict["s_game"]){
            console.log("场景没有初始化好！")
            return
        }

        var children = this.nodeDict["s_game"].children
        for(var i=1; i<children.length; i++){
            for(var j=0; j<children[i].children.length; j++){
                if(data[i-1] && data[i-1][j] && data[i-1][j]== 1){
                    children[i].children[j].active = true
                }else{
                    children[i].children[j].active = false
                }
            }
        }

        if(score>=0){
            this.nodeDict["lab_score"].getComponent(cc.Label).string = score
        }
    },

    setOtherGameView(data){

        if(!this.nodeDict || !this.nodeDict["o_game"]){
            console.log("场景没有初始化好！")
            return
        }

        var children = this.nodeDict["o_game"].children
        for(var i=1; i<children.length; i++){
            for(var j=0; j<children[i].children.length; j++){
                if(data[i-1] && data[i-1][j] &&data[i-1][j]== 1){
                    children[i].children[j].active = true
                }else{
                    children[i].children[j].active = false
                }
            }
        }
    },

    setGameEnd(data){
        UIManager.Show("prefab/", "end", function(uiNode) {
            uiNode.param = data
        })
    },

});