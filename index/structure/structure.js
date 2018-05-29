//单位（机构类）组织架构管理
const AV = require('../../libs/leancloud-storage.js');
var app = getApp()          //设置组织架构
Page({
	data:{
    userRolName: '',
		uUnitUsers: {},
		navBarTitle: app.roleData.uUnit.nick+'的组织架构',      //将页面标题设置成单位名称
		pw: app.sysinfo.pw,
		mRols: [
			['办公','产品','营销','客服'],
			['负责人','部门管理','员工']
		],
		crole: {},
		applyUser: [],
		cmRole:[0,0],
		reqrole: [0,0],
    reqstate: 0,
		eRole: '00'                        //岗位代码
	},
  aUser: {},

  onLoad: function () {
    var that = this;
    if (app.roleData.user.mobilePhoneNumber && app.roleData.uUnit.length>0) {			// 当前用户已注册且已有单位
      if (app.roleData.uUnit.afamily<3) {
        wx.showToast({ title: '非机构类单位,没有下级员工设置。', duration: 7500 })
        wx.navigateBack({ delta: 1 })                // 回退前1 页面
      } else {
        if (app.roleData.uUnit.name == app.roleData.user.objectId) {                //创建人读取单位员工信息
          new AV.Query('reqUnit').equalTo('rUnit', app.roleData.user.unit).find().then((applyUser) => {
            that.setData({ applyUser: applyUser });
          }).catch(console.error);
          let crole = {};
          app.roleData.uUnit.unitUsers.map((cuser) => { return crole[cuser.objectId] = true });
          that.setData({
            crole: crole,
            uUnitUsers: app.roleData.uUnit.unitUsers
          })
        } else {
          new AV.Query('reqUnit').equalTo('userId', app.roleData.user.objectId).find().then((resus) => {
            if (resus.length == 0) {
              let reso = AV.Object.extend('reqUnit');
              that.aUser = new reso();
              that.aUser.set('userId', app.roleData.user.objectId);
              that.aUser.set('uName', app.roleData.user.uName);
              that.aUser.set('avatarUrl', app.roleData.user.avatarUrl);
              that.aUser.set('nickName', app.roleData.user.nickName);
              that.aUser.set('rUnit', app.roleData.user.unit);
              that.aUser.set('rRolArray', [4, 4]);
            } else {
              that.setData({ reqstate: 1, reqrole: resus[0].get('rRolArray') });
            }
          }).catch(console.error())
        }
      };
    } else {
      wx.showToast({ title: '没有注册用户或申请单位,请在个人信息菜单注册。', duration: 7500 })
      wx.navigateBack({ delta: 1 })                // 回退前1 页面
    };
    that.setData({
			userRolName: app.roleData.user.userRolName
		})
  },
	giveRole: function(rHandle,operation,sRole) {
	  let rols={
			"au01": "592e7f8f7a1ff90032531b62",
			"au02": "592e7fb77a1ff90032531b65",
			"au10": "592e8107315c1e0050c9b214",
			"au11": "592e8148315c1e0050c9b222",
			"au12": "592e82627a1ff90032531bb1",
			"au20": "592e8343315c1e0050c9b30c",
			"au21": "592e8350315c1e0050c9b30d",
			"au22": "592e83577a1ff90032531bb4",
			"au30": "592e8366315c1e0050c9b314",
			"au31": "592e83737a1ff90032531bb5",
			"au32": "592e837a315c1e0050c9b31a",
			"bu00": "592e8414315c1e0050c9b348",
			"bu10": "592e841c7a1ff90032531bb9",
			"bu11": "592e84227a1ff90032531bba",
			"bu01": "592e842d7a1ff90032531bbc",
			"bu02": "592e8438315c1e0050c9b352",
			"bu12": "592e8440315c1e0050c9b353",
			"bu20": "592e8450315c1e0050c9b354",
			"bu21": "592e8458315c1e0050c9b35a",
			"bu22": "592e845e315c1e0050c9b35b",
			"bu30": "592e84687a1ff90032531bbd",
			"bu31": "592e846e7a1ff90032531bbe",
			"bu32": "592e84767a1ff90032531bbf",
			"cu00": "59ce950d9545040067999f95",
			"cu01": "59ce951217d0090063a0f6d3",
			"cu02": "59ce9520a22b9d0061333f33",
			"cu10": "59ce9576570c35088c8a56b2",
			"cu11": "59ce9584128fe1529c2c35f1",
			"cu12": "59ce9593ee920a0044c16116",
			"cu20": "59ce959817d0090063a0f7ae",
			"cu21": "59ce95a2570c35088c8a56ee",
			"cu22": "59ce95ac67f356003a603989",
			"cu30": "59ce95b8fe88c2003c3ef616",
			"cu31": "59ce95c317d0090063a0f7f2",
			"cu32": "59ce95cb67f356003a6039bb"};
		let sUser = AV.Object.createWithoutData('_User',operation);
		if (sRole=='sessionuser'){
		  var rQuery = AV.Object.createWithoutData('userInit', "59af7119ac502e006abee06a");
		  sUser.set('emailVerified', false );
		  sUser.set('unit', '0' );
		} else {
		  var rQuery = AV.Object.createWithoutData('userInit', rols[rHander+sRole]);  //设定菜单为
		  sUser.set('emailVerified', true );
		}
		sUser.set('userRolName',sRole);
		sUser.set('userRol',rQuery);
		return sUser.save().then(function(){
		  return '授权成功';
		},function(error){
		  return error;
		});
	}),

	fSpicker: function(e) {                         //选择岗位和条线
		let rval = e.detail.value;
		this.setData({ reqrole: rval,
			eRole: rval[0].toString()+ rval[1].toString() });     //对申请条线和岗位进行编码
	},

	fManageRole: function(e) {                         //点击解职、调岗操作
    var that = this;
		let unitRole = new AV.Role(app.roleData.uUnit.name);
		let rN = Number(e.currentTarget.dataset.id), muRole = 'sessionuser';
		return new Promise((resolve, reject) => {
			var uId = app.roleData.uUnit.unitUsers[rn].objectId;
      if (e.currentTarget.id=='mr_0') {               //解职
        unitRole.getUsers().remove(uId);
				app.roleData.uUnit.unitUsers.splice(rN,1);
      } else {                                     //调岗
				that.data.crole[uId] = true;
	    	that.setData({ crole: that.data.crole });
				app.roleData.uUnit.unitUsers[rN].userRolName = that.data.cmRole[0].toString()+ that.data.cmRole[1].toString() ;
				muRole = app.roleData.uUnit.unitUsers[rN].userRolName;
			};
			unitRole.set('unitUsers',app.roleData.uUnit.unitUsers);
			unitRole.save().then((muser) => { resolve(muRole); })
		}).then((uSetRole)=>{
			that.giveRole(app.roleData.uUnit.indType.indexOf(620406)>=0 ? 'bu' : 'au' , uId , uSetRole).then( ()=>{
				that.setData({ uUnitUsers: app.roleData.uUnit.unitUsers });
			})
    }).catch(console.error())
	},

	fManageApply: function(rn){
		var that = this;
		let unitRole = new AV.Role(app.roleData.uUnit.name);
		let rN = Number(e.currentTarget.dataset.id);
		return new Promise((resolve, reject) => {
			var uId = that.data.applyUser[rN].userId;
      if (e.currentTarget.id=='mr_2') {                          //同意
					let auRole = that.data.applyUser[rN].rRolArray[0].toString()+that.data.applyUser[rn].rRolArray[1].toString()
					app.roleData.uUnit.unitUsers.push({"objectId":uId, "userRolName":rR, 'uName':that.data.applyUser[rn].uName, 'avatarUrl':that.data.applyUser[rn].avatarUrl,'nickName':that.data.applyUser[rn].nickName})
					that.setData({ uUnitUsers: app.roleData.uUnit.unitUsers });
					unitRole.getUsers().add(uId);
					unitRole.set('unitUsers',app.roleData.uUnit.unitUsers);
          unitRole.save().then((adduser) => { resolve(auRole) })
      } else {             //拒绝
				resolve('sessionuser');
			};
		}).then((uSetRole)=>{
			that.giveRole(app.roleData.uUnit.indType.indexOf(620406)>=0 ? 'bu' : 'au' , uId , uSetRole).then( ()=>{
				AV.Object.createWithoutData('reqUnit',that.data.applyUser[rN].objectId).destroy().then(()=>{
					that.data.applyUser[rn].splice(rN,1);
					that.setData({applyUser:that.data.applyUser});
				})
			})
    }).catch(console.error)
	},

	fChangeRole: function(e){                  //打开调岗选择
    this.data.crole[e.currentTarget.dataset.id] = !this.data.crole[e.currentTarget.dataset.id];
    this.setData({ crole: this.data.crole })
	},
	rChange: function (e) {
    this.setData({ mIndex: e.detail.value })
  },

	mColumnChange: function (e) {
		this.data.cmRole[e.detail.column] = e.detail.value;
    this.setData({ cmRole: this.data.cmRole })
  },

	fApply: function (e) {
		if (this.data.reqstate==1){
			wx.showToast({title: '岗位申请等待审批。',duration: 3500});
		} else {
			this.aUser.set('rRolArray',this.data.reqrole );
			let mReqUnit = new AV.Role(app.roleData.uUnit.name);
			let mReqACL = new AV.ACL();
			mReqACL.setPublicReadAccess(false);
			mReqACL.setPublicWriteAccess(false);
			mReqACL.setRoleWriteAccess(mReqUnit,true);
			mReqACL.setRoleReadAccess(mReqUnit,true);
			mReqACL.setReadAccess(app.roleData.user.objectId,true)
			this.aUser.setACL(mReqACL);
	    this.aUser.save().then((suser)=>{
				wx.showToast({title: '岗位申请已提交,请等待审批。',duration: 3500});
			}).catch(console.error())
		};
		wx.navigateBack({ delta: 1 })
  }
})
