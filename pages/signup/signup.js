const AV = require('../../../libs/leancloud-storage.js');

var app = getApp()
Page({
  data:{
    user: {},
    sysheight: app.sysinfo.windowHeight-300,
    swcheck: true,
    iName: app.roleData.user.uName,
    uName: '',
    phonen: '',
    vcoden: '',
    cUnitInfo: '创建或加入单位',
    activeIndex: "0",
    rejectWxPhone: false
	},
  wxlogincode: '',

  getLoginCode: function() {
    var that=this;
    wx.login({
      success: function (wxlogined) {
        that.wxlogincode = (wxlogined.code) ? wxlogined.code : ''
      }
    });
    return
  },

  editenable: function(e) {                         //点击条目进入编辑或选择操作
    if (e.currentTarget.id == '0'){
      this.setData({activeIndex: "0" });
      this.getLoginCode();
    } else {
      if (!app.roleData.user.mobilePhoneVerified){
        this.setData({ activeIndex: "0", cUnitInfo: '创建或加入单位(必须验证手机号)' });
      } else {
        if (!app.roleData.user.uName) {
          this.setData({ cUnitInfo: '创建或加入单位(必须输入姓名)' });
        } else {
          this.setData({ activeIndex: "1"})
        }
      }
    }
  },

  onLoad: function () {
    var that = this;
    if (app.roleData.user.unit!='0') {
      if (app.roleData.uUnit.name == app.roleData.user.objectId) {
        that.data.cUnitInfo = '您创建的单位' + (app.roleData.user.emailVerified ? '' : '正在审批中')
      } else {
        that.data.cUnitInfo = '您工作的单位' + (app.roleData.user.emailVerified ? '' : '正在审批中')
      }
    }
    that.setData({		    		// 获得当前用户
      user: app.roleData.user,
      activeIndex: app.roleData.user.mobilePhoneVerified ? "1" : "0",
      cUnitInfo: that.data.cUnitInfo,
      vc: app.roleData.uUnit
    })
  },

	fswcheck: function(e){
		this.setData({ swcheck: !this.data.swcheck });
	},

  gUserPhoneNumber: function(e) {
    var that = this;
    if (that.wxlogincode) {
      if (e.detail.errMsg == 'getPhoneNumber:ok'){
        AV.Cloud.run('gPN', { code: that.wxlogincode, encryptedData: e.detail.encryptedData, iv: e.detail.iv }).then(function() {
          wx.showToast({
            title: '微信绑定的手机号注册成功', duration: 2000
          })
          app.roleData.user.mobilePhoneVerified = true;
          that.setData({ 'user.mobilePhoneVerified':app.roleData.user.mobilePhoneVerified})
        }).catch(console.error());
      } else {
        wx.showToast({
          title: '未授权使用微信手机号', duration: 2000
        });
        that.setData({ rejectWxPhone: true });               //输入手机号验证注册
      }
    } else {
      wx.showToast({
        title: '需要进行微信登录，请再次点击本按钮。', duration: 2000
      });
      that.getLoginCode();
    }
  },

  i_Name: function(e) {							//修改用户姓名
    if ( e.detail.value.uName ) {                  //结束输入后验证是否为空
			AV.User.current()
        .set({ "uName": e.detail.value.uName })  // 设置并保存用户姓名
				.save()
				.then((user)=> {
          app.roleData.user['uName'] = e.detail.value.uName;
          this.setData({ iName: e.detail.value.uName})
			}).catch((error)=>{console.log(error)
				wx.showToast({title: '修改姓名出现问题,请重试。'})
			});
		}else{
			wx.showModal({
  			title: '姓名输入错误',
  			content: '姓名输入不能为空！'
      });
		}
  },
  getvcode: function(e) {							//向服务器请求验证码
		var phone = e.detail.value['inputmpn'];
		if ( phone && /^1\d{10}$/.test(phone) ) {                  //结束输入后验证手机号格式
			this.setData({phonen : phone})
			AV.User.current()
				.setMobilePhoneNumber(phone)  // 设置并保存手机号
				.save()
				.then(function(user) {
				AV.Cloud.run('vsmp',{ mbn:phone })       // 发送验证短信请求
				}).then(function(){
				wx.showToast({title: '请查看手机短信找到验证码'})
			}).catch((error)=>{
				wx.showToast({title: '手机号短信注册出现问题,换一个手机号再试试。'})
			});
		}else{
			wx.showModal({
			title: '手机号输入错误',
			content: '请重新输入正确的手机号！'
			});
			this.setData({phonen : ''});
		}
  },

  fpvcode: function (e) {                         //验证并绑定手机号
		var vcode = e.detail.value.inputvc;
		if( vcode && /\d{6}$/.test(vcode) ) {           //结束输入后检查验证码格式
			this.setData({vcoden : vcode})
			AV.Cloud.run('vSmsCode',{mbn:this.data.phonen,mcode:this.data.vcoden}).then( (mVerfied) => {              // 用户填写收到的短信验证码
				app.roleData.user.mobilePhoneNumber = this.data.phonen;
				app.roleData.user.mobilePhoneVerified = true;
				this.setData({
					user: app.roleData.user,
					activeIndex : 1
				});
			}).catch( (error)=>{                 //验证失败将旧手机号保存（若有）
				AV.User.current()
					.set({ "mobilePhoneNumber": app.roleData.user.mobilePhoneVerified ? app.roleData.user.mobilePhoneNumber : "",
                 "mobilePhoneVerified": app.roleData.user.mobilePhoneVerified ? true : false })
					.save()
			})
		}else{
			wx.showModal({
			title: '验证码输入错误',
			content: '请重新输入正确的验证码'
			});
			this.setData({vcoden : ''});
		}
  },

  makeunit: function(e) {                         //创建单位并申请负责人岗位
    var that = this;
		var reqUnitName = e.detail.value.uName;
    if (reqUnitName){
      var fSeatch = new AV.Query('_Role');
      fSeatch.equalTo('uName',reqUnitName);
      fSeatch.find().then((results)=>{
        if (results.length==0){                      //申请单位名称无重复
          let crUnit = new AV.ACL();
          crUnit.setWriteAccess(AV.User.current(), true)     // 当前用户是该角色的创建者，因此具备对该角色的写权限
          crUnit.setPublicReadAccess(true);
          crUnit.setPublicWriteAccess(false);
          let unitRole = new AV.Role(app.roleData.user.objectId,crUnit);   //用创建人的ID作ROLE的名称
          unitRole.getUsers().add(AV.User.current());
          unitRole.set('uName',reqUnitName)
          unitRole.set('unitUsers',[{"objectId":app.roleData.user.objectId, "userRolName":'admin', 'uName':app.roleData.user.uName, 'avatarUrl':app.roleData.user.avatarUrl,'nickName':app.roleData.user.nickName}] );
          unitRole.save().then((res)=>{
            app.roleData.uUnit = res.toJSON();
            let rQuery = AV.Object.createWithoutData('userInit', '598353adfe88c200571b8636')  //设定菜单为applyAdmin
            AV.User.current()
              .set({ "unit": res.objectId, "userRolName": 'admin', "userRol": rQuery })  // 设置并保存单位ID
              .save()
              .then(function(user) {
                app.getRols(res.objectId);
                wx.navigateTo({ url: '/inputedit/f_Role/f_Role' })
              }).catch((error) => { console.log(error)
              wx.showToast({title: '修改用户单位信息出现问题,请重试。'})	});
          }).catch((error) => { console.log(error);
            wx.showToast({ title: '新建单位时出现问题,请重试。', duration: 7500}) })
        }else{
          wx.showModal({
            title: '已存在同名单位',
            content: '选择取消进行核实修改，选择确定则申请加入该单位！',
            success: function(res) {
              if (res.confirm) {              //用户点击确定则申请加入该单位
                let resUnit = results[0].toJSON();
                let rQuery = AV.Object.createWithoutData('userInit', '59af7119ac502e006abee06a')  //设定菜单为sessionuser
                AV.User.current()
                  .set({ "unit": resUnit.objectId, "userRolName": 'sessionuser', "userRol": rQuery } )  // 设置并保存单位ID
                  .save()
                  .then(function(user) {
                    app.roleData.uUnit = resUnit;
                    app.roleData.user.unit = resUnit.objectId;
                    that.setData({user : app.roleData.user});
                    wx.navigateTo({ url: '/index/structure/structure' });
                  })
              } else if (res.cancel) {        //用户点击取消
                that.setData({uName: ''});
              }
            }
          })
        }
      }).catch(function(error) { console.log(error) });                                     //打印错误日志
    }
	}

})
