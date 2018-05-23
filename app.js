const AV = require('./libs/leancloud-storage.js');
const Realtime = require('./libs/leancloud-realtime.js').Realtime;
const TypedMessagesPlugin = require('./libs/leancloud-realtime-plugin-typed-messages.js').TypedMessagesPlugin;
const TextMessage = require('./libs/leancloud-realtime.js').TextMessage;
const ImageMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').ImageMessage;
const AudioMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').AudioMessage;
const VideoMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').VideoMessage;
const LocationMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').LocationMessage;
const FileMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').FileMessage;
AV.init({
  appId: "Trce3aqbc6spacl6TjA1pndr-gzGzoHsz",                    // 初始化存储 SDK
  appKey: "CBbIFAhL4zOyCT9PQM5273bP"
});
const realtime = new Realtime({
  appId: 'Trce3aqbc6spacl6TjA1pndr-gzGzoHsz',                      // 初始化实时通讯 SDK
  appKey: "CBbIFAhL4zOyCT9PQM5273bP",
  region: 'cn',                                               // 目前仅支持中国节点 cn
  noBinary: true,
  plugins: [TypedMessagesPlugin],                    // 注册富媒体消息插件
  pushOfflineMessages: true                          //使用离线消息通知方式
});
function onNet() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == 'none') {
          resolve(false);
          wx.showToast({ title: '请检查网络！' });
        } else {
          resolve(true);
        }
      }
    });
  })
};
App({
  roleData: wx.getStorageSync('roleData') || require('globaldata.js').roleData,
  mData: wx.getStorageSync('mData') || require('globaldata.js').mData,                          //以objectId为key的数据记录
  aData: wx.getStorageSync('aData') || require('globaldata.js').aData,              //读数据记录的缓存
  aCount : wx.getStorageSync('aCount') || require('globaldata.js').aData,
  procedures: wx.getStorageSync('procedures') || {},              //读流程的缓存
  netState: onNet(),
  logData: [],                         //操作记录
  fwClient: {},                        //实时通信客户端实例
  fwCs: [],                           //客户端的对话实例
  fwUnreads: {},                      //客户端的未读对话实例
  conMsg: {},                           //对话信息记录
  nowOpenChat:{},      //当前打开的对话

  imLogin: function(){                               //实时通信客户端登录
    var that = this;
    realtime.createIMClient(that.roleData.user.objectId).then( (im)=> {
      that.fwClient = im;
      that.fwClient.getQuery().containsMembers([that.roleData.user.objectId]).find().then( (conversations)=> {  // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
        that.fwCs = conversations.map( (conversation)=> {
          if (!that.conMsg[conversation.id]){that.conMsg[conversation.id]=[]};
          conversation.on('message', function messageEventHandler(message) {
            that.conMsg[conversation.id].push(that.mParse(message))
            if (conversation.id==that.nowOpenChat.data.cId){                               //当前打开的对话修改消息数据
              that.nowOpenChat.setData({message:that.conMsg[conversation.id]})
            }
          });
          return conversation;
        });
      });
      that.fwClient.on('unreadmessagescountupdate', function unreadmessagescountupdate(unreadconversations) {
        unreadconversations.forEach(urcst=> { that.fwUnreads[urcst.id]=urcst });
      });
    });
  },

  sendM: function(sMessage,conversationId){
    var that = this;
    var sendMessage;
    switch (sMessage.mtype) {
      case -1:
        sendMessage = new TextMessage(sMessage.mtext);
        if (sMessage.wcontent){
          sendMessage.setAttributes({ mcontent:sMessage.wcontent })  //如有产品、订单等附加信息信息则发送之
        };
        break;
      case -2:
        sendMessage = new ImageMessage(sMessage.wcontent);       //根据图像文件上传成功路径构建消息实例
        sendMessage.setText('图片消息: ' + sMessage.mtext);
        break;
      case -3:
        sendMessage = new AudioMessage(sMessage.wcontent);       //根据音频文件上传成功路径构建消息实例
        sendMessage.setText('音频消息: ' + sMessage.mtext);
        break;
      case -4:
        sendMessage = new VideoMessage(sMessage.wcontent);       //根据视频文件上传成功路径构建消息实例
        sendMessage.setText('视频消息: ' + sMessage.mtext);
        break;
      case -5:
        sendMessage = new LocationMessage(sMessage.wcontent);       //根据位置构建消息实例
        sendMessage.setText('位置消息: ' + sMessage.mtext);
        break;
      case -6:
        sendMessage = new FileMessage(sMessage.wcontent);       //根据文件上传成功路径构建消息实例
        sendMessage.setText('文件消息: ' + sMessage.mtext);
        break;
      default:
        return;
    };
    sendMessage.setAttributes({                                 //发送者呢称和头像
      avatarUrl: that.roleData.user.avatarUrl,
      uName: that.roleData.user.uName
    });
    return new Promise((resolve, reject) => {
      that.fwClient.getConversation(conversationId).then(function(conversation) {
        conversation.send(sendMessage).then(function(){
          that.conMsg[conversationId].push(sMessage);
          resolve(true);
        });
      });
    }).catch((error)=>{ reject(error) });
  },

  getM: function(conversationId){                   //接收未读消息内容
    var that = this;
    return new Promise((resolve, reject) => {
      that.fwClient.getConversation(conversationId).then(function(conversation) {
        if (conversation.unreadMessagesCount>0){
          conversation.queryMessages({ limit: conversation.unreadMessagesCount }).then(function(messages) {    //取limit条消息，取值范围 1~1000，默认 20
            messages.forEach((message)=>{ that.conMsg[conversationId].push(that.mParse(message)) });     //解析最新的limit条消息，按时间增序排列
            resolve(true);
          });
        } else { resolve(false) }
      }).catch(console.error.bind(console));
    })
  },

  mParse: function(message,conversation){                   //根据消息和对话实例解析消息内容
    var that = this;
    var mfile;
    let rMessage = {};
    rMessage.type = message.type;
    rMessage.objectId = message.id;
    rMessage.wtext = message.getText();
    switch (message.type) {
      case TextMessage.TYPE:
        if (typeof message.getAttributes() != 'undefined'){
          if (message.getAttributes().mcontent){ rMessage.wcontent = message.getAttributes().mcontent;}
        }
        break;
      case FileMessage.TYPE:
        mfile = message.getFile(); // file 是 AV.File 实例
        rMessage.wcontent = mfile.url();
        break;
      case ImageMessage.TYPE:
        mfile = message.getFile();
        rMessage.wcontent = mfile.url();
        break;
      case AudioMessage.TYPE:
        mfile = message.getFile();
        rMessage.wcontent = mfile.url();
        break;
      case VideoMessage.TYPE:
        mfile = message.getFile();
        rMessage.wcontent = mfile.url();
        break;
      case LocationMessage.TYPE:
        rMessage.wcontent = message.getLocation();
        break;
      default:
        console.warn('收到未知类型消息');
    }
    if (typeof message.getAttributes() != 'undefined'){
      rMessage.uName = message.getAttributes().uName;
      rMessage.avatarUrl = message.getAttributes().avatarUrl;
    }
    return rMessage;
  },

  onLaunch: function ({ path, query, scene, shareTicket, referrerInfo }) {
    var that = this;            //调用应用实例的方法获取全局数据
    wx.getSystemInfo({                     //读设备信息
      success: function (res) {
        that.sysinfo = res;
        let sdkvc = res.SDKVersion.split('.');
        let sdkVersion = parseFloat(sdkvc[0] + '.' + sdkvc[1] + sdkvc[2]);
        if (sdkVersion < 2.0) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法正常使用，请升级到最新微信版本后重试。',
            compressed(res) { setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000); }
          })
        } else {
          AV.Cloud.run('writers', ).then(myip => { that.sysinfo.userip=myip; })
          that.sysinfo.pw={
            statusBar: res.statusBarHeight,
            capsule: res.screenHeight - res.windowHeight-8,
            cwHeight: res.windowHeight - res.statusBarHeight
          }
        };
      }
    });
  },

  onShow: function ({ path, query, scene, shareTicket, referrerInfo }) {
    var that = this;
    wx.onNetworkStatusChange(res => {
      if (!res.isConnected) {
        that.netState = false;
        wx.showToast({ title: '请检查网络！' });
      } else {
        that.netState = true;
      }
    });
  },

  onHide: function () {             //进入后台时缓存数据。
    var that=this;
    wx.getStorageInfo({             //查缓存的信息
      success: function(res) {
        if ( res.currentSize>(res.limitSize-512) ) {          //如缓存占用大于限制容量减512kb，将大数据量的缓存移除。
          wx.removeStorage({key:"aData"});
          wx.removeStorage({key:"mData"});
          wx.removeStorage({key:"procedures"});
        }else{
          wx.setStorage({key:"aData", data:that.aData});
          wx.setStorage({key:"mData", data:that.mData});
          wx.setStorage({ key: 'roleData', data: that.roleData });
          wx.setStorage({ key: 'aCount', data: that.aCount });
          wx.setStorage({key:"procedures", data:that.procedures});
        }
      }
    });
    let logData = that.logData.concat(wx.getStorageSync('loguser') || []);  //如有旧日志则拼成一个新日志数组
    if (logData.length>0){
      wx.getNetworkType({
        success: function(res) {
          if (res.networkType=='none') {                     //如果没有网络
            wx.setStorageSync('loguser', logData)           //缓存操作日志
          }else{
            let loguser = AV.Object.extend('userlog');       //有网络则上传操作日志
            let userlog = new loguser();
            userlog.set('userObjectId',that.roleData.user.objectId);
            userlog.set('workRecord',logData);
            userlog.save().then( resok =>{
              wx.removeStorageSync('loguser');              //上传成功清空日志缓存
            }).catch( (error) =>{                            //上传失败保存日志缓存
              wx.setStorage({ key: 'loguser', data: logData })
            })
          }
        }
      })
    }
  },

  onError: function(msg) {
    this.logData.push([Date.now(), '系统错误:'+msg]);
  }

})
