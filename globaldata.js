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
  wmenu: {
    initVale:[                         //用户未注册时的基础菜单
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
    updatedAt: '0'
    }
  mData: {
    pAt:{
      articles:[                                //缓存中已发布文章更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      asset:[                                //缓存中已发布固定资产更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      product:[                                //缓存中已发布产品更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      service:[                                //缓存中已发布服务更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      cargo:[                                //缓存中已发布成品更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      goods:[                                //缓存中已发布商品更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      specs :[                                //缓存中已发布规格更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      promotion: [                                //缓存中已发布团购众筹更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ],
      prodesign: [                                //缓存中已发布生产计划更新时间
        new Date(0),                          //最早更新时间
        new Date(0)                          //目前记录时间
      ]
    },
    proceduresAt:[                                //缓存中流程更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    articles: [[], [], [], [], [], []],              //已发布文章分类缓存数组
    pCk1: 1,            //已发布文章分类阅读选中序号
    pCk8: 1,            //已发布团购众筹分类阅读选中序号
    asset: [],              //已发布固定资产缓存数组
    product: [],              //已发布产品分类缓存数组
    service: [],              //已发布服务分类缓存数组
    cargo: [],              //已发布成品分类缓存数组
    goods: [],              //已发布商品分类缓存数组
    specs: [],              //已发布规格分类缓存数组
    promotion: [[],[], []],              //已发布团购众筹分类缓存数组
    prodesign: [],              //已已发布生产计划缓存数组
    procedures: [],              //流程分类缓存数组
    proceduresCk: -1,
  }
}
