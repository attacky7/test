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
        bgmVolume: 1.0,
        sfxVolume: 1.0,

        bgmAudioID: -1,
    },

    // use this for initialization

    //初始化音频管理器的基本功能
    init: function() {
        var t = cc.sys.localStorage.getItem("bgmVolume"); //获取本地的背景音乐音量大小数值
        if (t != null) { //初始化背景音乐 有就直接拿本地的 没就设置为初始值
            this.bgmVolume = parseFloat(t);
        }
        //初始化音效音乐 有就直接拿本地的 没就设置为初始值
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.sfxVolume = parseFloat(t);
        }

        //添加一个回到桌面事件,暂停所有音频
        cc.game.on(cc.game.EVENT_HIDE, function() {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        //添加一个回到从桌面回到游戏事件,继续所有音频
        cc.game.on(cc.game.EVENT_SHOW, function() {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    //获取本地的音频资源文件
    getUrl: function(url) {
        return cc.url.raw("resources/sounds/" + url);
    },

    //播放背景音乐
    playBGM(url) {
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    },

    //播放音效
    playSFX(url = "button.mp3") {
        var audioUrl = this.getUrl(url);
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
        return audioId;
    },

    //播放特殊音效
    playEffectSFX(url, isLoop) {
        var audioUrl = this.getUrl(url);
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, isLoop, this.sfxVolume);
        }
        return audioId;
    },

    //设置音效 音量大小
    setSFXVolume: function(v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    },

    //设置背景音乐 音量大小
    setBGMVolume: function(v, force) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if (this.bgmVolume != v || force) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    //封装cocos引擎自带的audioEngine的方法
    pauseAll: function() {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function() {
        cc.audioEngine.resumeAll();
    },

    //停止所有音效（会把背景音乐也关掉没有办法使用）
    stopAllEffects() {
        cc.audioEngine.stopAllEffects();
    },

    //停止单个音效
    stopEffect(id) {
        cc.audioEngine.stopEffect(id);
    },
});