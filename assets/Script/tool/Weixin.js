cc.Class({

    config: function() {
        if (typeof(wx) == "undefined") {
            console.log("H5微信sdk在cocos引擎无法调用");
            return false
        }
        console.log("进来了吗：：：？")

        console.log(wx)
        wx.login({
            success(res) {
                console.log("lalalalall::::::")
                if (res && res.code) {
                    console.log("获取微信code成功！")
                    wx.request({
                        url: "https://www.block-game.top/login",
                        data: {
                            code: res.code
                        },

                        success(data) {
                            cc.gg.auth = data.data.auth
                        },
                    })
                } else {
                    console.log("获取微信code失败！")
                }
                wx.getSetting({

                    success(res){
                        if(res.authSetting["scope.userInfo"]){
                            wx.getUserInfo({
                                success: function(res) {
                                    console.log("获取用户信息：", res)
                                    cc.gg.wxInfo = res.userInfo
                                }
                              })
                        }else{


                            let button = wx.createUserInfoButton({
                                type: 'text',
                                text: '获取用户信息',
                                style: {
                                  left: 10,
                                  top: 76,
                                  width: 200,
                                  height: 40,
                                  lineHeight: 40,
                                  backgroundColor: '#ff0000',
                                  color: '#ffffff',
                                  textAlign: 'center',
                                  fontSize: 16,
                                  borderRadius: 4
                                }
                              })
                            button.onTap((res) => {
                                console.log(res)
                                if(res.errMsg == "getUserInfo:ok")
                                {
                                    cc.gg.wxInfo = res.userInfo
                                    button.destroy()
                                }
                                else{
            
                                }
                            })


                        }
                        
                    }
                    
                })

               
            }
        })
    }
})