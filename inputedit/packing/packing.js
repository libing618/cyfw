// inputedit/packing.js
var COS = require('../../libs/cos-wx-sdk-v5')

var cos = new COS({
    getAuthorization: function (params, callback) {//获取签名 必填参数
        var authorization = COS.getAuthorization({
          SecretId: 'AKIDkJdhV4nUM2ThhTxukKflcDZfV5RXt5Ui',
          SecretKey: 'A5lCRSFpEQN6aqsfDVYMuEI6f081g8LK',
            Method: params.Method,
            Key: params.Key
        });
        callback(authorization);
    }
});

var requestCallback =function (err, data) {
    console.log(err || data);
    if (err && err.error) {
        wx.showModal({title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false});
    } else if (err) {
        wx.showModal({title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false});
    } else {
        wx.showToast({title: '请求成功', icon: 'success', duration: 3000});
    }
};

var option = {
    data: {
      list: [],
    },
};

option.simpleUpload = function () {
    // 选择文件
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var filePath = res.tempFilePaths[0];//wxfbbbc7b7f73ae7fb.o6zAJs41NybK0XgFbUrBA2VyNdVw.zOBxHczLQmQMe305f48099d94d4a82b3d2a27e43baf6.png
            var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名

            cos.postObject({
              Bucket: 'lg-la2p7duw-1254249743',
              Region: 'ap-shanghai',
                Key: Key,
                FilePath: filePath,
                onProgress: function (info) {
                    console.log(JSON.stringify(info));
                }//https://lg-la2p7duw-1254249743.cos.ap-shanghai.myqcloud.com/wxfbbbc7b7f73ae7fb.o6zAJs41NybK0XgFbUrBA2VyNdVw.zOBxHczLQmQMe305f48099d94d4a82b3d2a27e43baf6.png
            }, requestCallback);
        }
    })
};

//获取应用实例
Page(option);
