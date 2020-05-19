// var TimerMgr = require('TimerMgr');
var keyAndValue = cc.Class({
    ctor: function() {
        this.index = 0;
        this.key = null;
        this.callback = null;
        this.value = null;
        this.hideFront = true;
    },

    setKeyValue: function(k, v, cb = null) {
        this.key = k;
        this.value = v;
        this.callback = cb;
    },

    setValue: function(v) {
        this.value = v;
    },

    setCallback: function(cb) {
        this.callback = cb;
    },

    setIndex: function(z) {
        this.index = z;
    },
});

var UIManager = cc.Class({

    ctor: function() {
        this.Bloading = false;
        this.curUIName = "";
        this.uiArray = new Array();
    },

    isLoading: function() {
        return this.Bloading;
    },

    // prefab 实例化后，存入uiarray中
    add: function(uiName, uiNode) {
        var it = this.getItem(uiName);
        if (!it) {
            console.log("没有保存在uiArrar,现在加载中： " + uiName);
            this.removeCurrentLoadingUI();
            // uiNode.destroy();
            this.Bloading = false;
            return;
        }
        it.setValue(uiNode);
        if (!it.callback) {
            // this.removeCurrentLoadingUI();
            // this.Bloading = false;
        } else {
            it.callback(uiNode);
        }

        // 加入节点显示
        var path;
        if (uiName.indexOf('Fight') == -1)
            path = "Canvas/UINode";
        else
            path = "Canvas/XXNode";

        var root = cc.find(path);
        if (!root) {
            console.log("UI 挂点未找到");
            this.Bloading = false;
            return;
        }
        root.addChild(uiNode);
        this.Bloading = false;
    },

    // 名字查找uiArray中的节点
    getItem: function(name) {
        for (var i = 0; i < this.uiArray.length; i++) {
            if (this.uiArray[i].key == name) {
                return this.uiArray[i];
            }
        }
        return null;
    },

    show: function(path, uiName, callback) {
        this.Bloading = true;
        var item = new keyAndValue();
        if (!item) {
            console.log("memory is not enought");
            return;
        }
        //qq
        if (this.getItem(uiName)) {
            this.destroy(uiName);
        }

        item.setKeyValue(uiName, null, callback);
        this.uiArray.push(item);
        this.curUIName = uiName;
        path += uiName;
        try {
            cc.loader.loadRes(path, this.onLoadEnd.bind(this));
        } catch (error) {
            //加载资源失败，删除当前添加节点
            // this.removeLastItem();
            console.log(uiName + " load error: " + error.stack);
        }
    },

    onLoadEnd: function(error, prefab) {
        // 移除资源加载监听
        if (error) {
            console.log("loadres error " + error.stack);
            this.removeCurrentLoadingUI();
            this.Bloading = false;
            return;
        }

        //实例化Ui
        var ui = cc.instantiate(prefab);
        if (!ui) {
            // 实例化失败
            this.removeCurrentLoadingUI();
            this.Bloading = false;
            return;
        }
        console.log("实例ui名称》》》:" + ui.name);
        this.add(ui.name, ui);
    },

    // 删除uiArray 的最后一个节点
    removeCurrentLoadingUI: function() {
        this.destroy(this.curUIName);
        this.curUIName = null;
    },

    removeItem: function(uiName) {
        for (var i = 0; i < this.uiArray.length; i++) {
            if (this.uiArray[i].key == uiName) {
                var it = this.uiArray[i];
                this.uiArray.splice(i, 1);
                return it;
            }
        }
        return null;
    },

    destroy: function(uiName) {
        var it = this.removeItem(uiName);
        if (!it) {
            //console.log("找不到移除的ui:" + uiName);
            return;
        }

        if (!it.value) {
            console.log(uiName + " remove,but it is't instantiate ");
            // this.removeCurrentLoadingUI();
        } else {
            it.value.removeself;
            it.value.destroy();
            it.value = null;
        }

        it.key = null;
        it = null;
    },

    release: function() {
        while (this.uiArray.length > 0) {
            this.destroy(this.uiArray[this.uiArray.length - 1]);
        }
    },
});


/*
 *  操作相关函数
 */

var Instance = null;

function Init() {
    Instance = new UIManager();
}

function Release() {
    Instance.release();
}

/*
 *  显示UI
 */
function Show(path, uiName, callback) {
    if (Instance.isLoading()) {
        console.log("is loading " + Instance.curUIName);
        // Instance.removeCurrentLoadingUI();
        // Instance.destroy(uiName);
        Instance.Bloading = false;
        // return;
    }

    Instance.show(path, uiName, callback);
}

/*
 * 移除UI
 */
function Remove(uiName) {
    Instance.destroy(uiName);
}

/*
 * 移除当前加载中的UI，用于加载超时使用，其他时刻谨慎使用
 */
function RemoveLoadingUI() {
    Instance.removeCurrentLoadingUI();
}

function ShowTips(path, uiName, callback) {
    Instance.showTips(path, uiName, callback);
}

module.exports = {
    Init: Init,
    Release: Release,
    Show: Show,
    Remove: Remove,
    RemoveLoadingUI: RemoveLoadingUI,
}