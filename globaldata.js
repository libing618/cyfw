module.exports={
  globalData:{
    user: {                                     //用户的原始定义
      "userRolName": "0",
      "unit": "0",
      "city": "Taiyuan",
      "uName": "0",
      "emailVerified": false,
      "nickName": "游客",
      "language": "zh_CN",
      "gender": 1,
      "province": "Shanxi",
      "avatarUrl": "../../images/index.png",
      "country": "CN",
      "userAuthorize": -1,
      "authData": {},
      "mobilePhoneVerified": false,
      "objectId": "0"},
    sysinfo: null
  },
  wmenu: [                         //用户未注册时的基础菜单
      [{"tourl": "./signup/signup",
      "mIcon": "../../images/index.png",
      "mName": "我的信息"}],
      [{
      "tourl": "/pages/fprocedure/fprocedure?pNo=3&artId=0",
      "mIcon": "../../images/iconfont-produce.png",
      "mName": "新增产品"}],
      [{
      "tourl": "/pages/fprocedure/fprocedure?pNo=3&artId=3",
      "mIcon": "../../images/iconfont-edit.png",
      "mName": "宣传文章"}],
      [{
      "tourl": "pages/lprocedures/lprocedures?pNo=1&artId=7",
      "mIcon": "../../images/iconfont-abook.png",
      "mName": "常见问题"}]
      ],
  mData: {
    pAt1 :[                                //缓存中已发布文章更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt2 :[                                //缓存中已发布固定资产更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt3 :[                                //缓存中已发布产品服务更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt4 :[                                //缓存中已发布产品规格更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt5: [                                //缓存中已发布团购众筹更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt6: [                                //缓存中已发布生产计划更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    proceduresAt:[                                //缓存中流程更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    prdct1: [[], [], [], [], [], []],              //已发布文章分类缓存数组
    pCk1: 1,            //已发布文章分类阅读选中序号
    pCk3: 1,            //已发布产品服务分类阅读选中序号
    pCk5: 1,            //已发布团购众筹分类阅读选中序号
    pCk6: 1,            //已发布生产计划分类阅读选中序号
    prdct2: [],              //已发布固定资产缓存数组
    prdct3: [[], []],              //已发布产品服务分类缓存数组
    prdct5: [[],[], []],              //已发布团购众筹分类缓存数组
    prdct4: [],              //已发布产品规格缓存数组
    prdct6: [[], [], [], [], [], []],              //已发布生产计划缓存数组
    procedures: [],              //流程分类缓存数组
    proceduresCk: -1,
    oAt0:new Date(0),                                //缓存中已销售产品数据更新时间
    oAt1:new Date(0),                                //缓存中客户评价数据更新时间
    oCk0: 0,            //原料操作分类阅读选中序号
    oped0: [],              //已销售产品缓存数组
    oped1: [],              //已发布客户评价缓存数组
  }
}
