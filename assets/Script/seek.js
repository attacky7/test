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

        this.nodeDict = {};

        var linkWidget = function(self, nodeDict) {
            var children = self.children;
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName) {
                    var nodeName = widgetName //.substring(4);
                    if (nodeDict[nodeName]) {
                        // cc.log("控件名字重复!" + children[i].name);
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
        cc.gg.utils.addClickEvent(this.nodeDict["cancle"], this.onBtnClick.bind(this));
    },


    onClose() {

    },

    onBtnClick(event) {
        var name = event.name;
        if (name == 'cancle') {
            UIManager.Remove("seek")
        }
    },

})
