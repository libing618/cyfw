module.exports = [
{
  "pNo": 0,
  "pName": "单位名称和负责人",
  "afamily": ['电商服务站','生产厂家','电子商务企业'],
  "pSuccess": [
    {inclose:true, gname:"indType", p:'主营业务', t:"industrytype", apdvalue:[0, 0, 0] },
    {gname:"nick", p:'单位简称',t:"h3" },
    {gname: "title", p: '单位简介', t: "p"},
    {gname: "desc", p: '单位描述', t: "p"},
    {gname: "thumbnail", p: '图片简介', t: "thumb" },
    {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
    {gname: "address", p: '地址', t: "ed"},
    {gname: "sUnit", p: '选择服务单位', t: "MS", e: '单位名称', indTypes: 620406 },
    {gname: "licenseNumber", p:'社会信用代码', t: "h3" },
    {gname:"pPhoto", p:'申请人手持身份证的照片',t:"pic", e:'http://ady3cqpl0902fnph-10007535.file.myqcloud.com/667b99d135e2d8fa876d.jpg' },
    {gname:"uPhoto", p:'单位营业执照或个人身份证背面的照片',t:"pic", e:'http://ady3cqpl0902fnph-10007535.file.myqcloud.com/80b1db6d2b4f0a1cc7cf.jpg' }
  ],
  "puRoles": [],
  "pBewrite": "单位负责人提出岗位和单位设置或修改申请，提交单位或个人身份证明文件的照片，由电子商务服务公司进行审批。",
  "suRoles": [
    "32",
    "31"
  ],
  "pModle": "_Role"
},
{
  "pNo": 1,
  "pName": "文章",
  "afamily": ['商圈人脉','品牌建设','扶持优惠','产品宣传','常见问题'],
  "pSuccess": [
    {gname:"uName", t:"h1", p:"名称" },
    {gname:"title",t:"h2", p:"标题" },
    {gname:"desc", t:"ap", p:"摘要" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "puRoles": [
    "20",
    "admin"
  ],
  "pBewrite": "编写各类文章，经单位领导审批后发布。个人编写的此类文章由所属服务机构审批。",
  "suRoles": [
    "21",
    "20"
  ],
  "pModle": "articles"
},
{
  "pNo": 2,
  "pName": "固定资产登记",
  "pSuccess": [
    {gname: "uName", p:'固定资产名称', t:"h3" },
    {inclose: true, gname:"assetType", p:'固定资产类别',t:"assettype", ascvalue:[0, 0, 0] },
    {gname:"title", p:'固定资产简介',t:"p" },
    {gname:"desc", p:'固定资产描述',t:"p", },
    {gname:"aGeoPoint", p:'地理位置',t:"chooseAd" },
    {gname: "address", p: '详细地址', t: "ed"},
    {gname:"thumbnail", p: '图片简介',t: "thumb" },
    {gname:"fcode", p: '编号',t: "inScan"  }
  ],
  "pBewrite": "综合条线提出固定资产设置或修改申请，由条线负责人进行审批。",
  "puRoles": [
    "32",
    "31"
  ],
  "sFinallyRole": "32",
  "pModle": "asset"
},
{
  "pNo": 3,
  "pName": "产品",
  "pSuccess": [
    {gname: "uName", p:'名称', t:"h3" },
    {inclose: true, gname:"protype", p:'产品类别',t:"producttype", pdva:[0, 0, 0] },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"aGeoPoint", p:'地理位置', t: "chooseAd" },
    {gname:"address", p:'地址', t: "ed" },
    {gname:"PARM_content", p:'内容', t:"h4" },
    {gname:"PARM_additive", p:'附加', t:"h4" },
    {gname:"PARM_attention", p:'注意事项', t:"h4" },
    {gname:"PARM_period", p:'期限(天)', t:"dg" },
    {gname:"standard_code", p:'执行标准', t:"h4" },
    {gname:"license_no", p:'许可证号', t:"h4" },
    {gname:"surface", p:'外观范围', t:"arrList" },
    {gname:"size", p:'尺寸范围', t:"arrList" },
    {gname:"weight", p:'重量范围', t:"arrList" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "product"
},
{
  "pNo": 4,
  "pName": "服务",
  "pSuccess": [
    {gname:"uName", p:'名称', t:"h3" },
    {gname:"afamily", p:'服务类型', inclose: true,t:"arrsel", aList:['快递送货','货运自提','柜台提货','店铺消费']},
    {gname:"title", p:'简介',t:"h4" },
    {gname:"aGeoPoint", p: '服务地位置', t: "chooseAd" },
    {gname:"address", p: '服务地址', t: "ed" },
    {gname:"price", p:'价格', t:"dg" },
    {gname:"serParty", p:'服务方', t:"h4" },
    {gname:"serName", p:'联系人姓名', t:"h4" },
    {gname:"serPhone", p:'联系人电话', t:"h4" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "service"
},
{
  "pNo": 5,
  "pName": "成品",
  "pSuccess": [
    {gname:"product", p:'产品', inclose: true,t:"sObject" },
    {gname:"uName", p:'规格名称', t:"h3" },
    {gname:"title", p:'规格简介',t:"p" },
    {gname:"thumbnail", p:'图片简介',t: "thumb" },
    {gname:"s_spec", p:'外观尺寸重量', t:"arrsel" },
    {gname:"retail_price", p:'零售价', t:"dg" },
    {gname:"stock", p:'库存', t:"dg" }
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "cargo"
},
{
  "pNo": 6,
  "pName": "商品",
  "pSuccess": [
    {gname: "uName", p:'名称', t:"h3" },
    {inclose: true, gname:"goodstype", p:'商品类别',t:"goodstype", pdva:[0, 0, 0] },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"desc", p:'描述',t:"p" },
    {gname:"afamily", p:'规格类型', inclose: true,t:"arrsel", aList:['单品','套餐']},
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"pics", p:'图片集',t:"pics"},
    {gname:"tvidio", p:'视频简介',t: "vidio" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "goods"
},
{
  "pNo": 7,
  "pName": "商品规格",
  "pSuccess": [
    {gname:"goods", p:'商品', inclose: true,t:"sObject" },
    {gname:"uName", p:'名称', t:"h3" },
    {gname:"cargo", p:'成品', inclose: true,t:"sCargo", provalue:[0,0] },
    {gname:"serFamily", p:'服务类型', inclose: true,t:"arrsel", aList:['快递送货','货运自提','柜台提货','店铺消费'] },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"desc", p:'描述',t:"p" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"package", p:'包装内数量', t:"dg" },
    {gname:"price", p:'零售价', t:"dg" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "specs"
},
{
  "pNo": 8,
  "pName": "众筹团购及促销",
  "afamily":['众筹','团购','促销'],
  "pSuccess": [
    {gname:"goods", p:'商品', inclose: true,t:"sObject" },
    {gname:"base_price", p:'基础优惠价', t:"dg" },
    {gname:"base_amount", p:'基础目标数量',t:"dg" },
    {gname:"big_price", p:'大额优惠价', t:"dg" },
    {gname:"big_amount", p:'大额目标数量',t:"dg" },
    {gname:"start_end", p:'活动起止日期', t:"sedate",endif:false}
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由营销条线负责人进行审批。",
  "puRoles": [
    "12",
    "31"
  ],
  "sFinallyRole": "32",
  "pModle": "promotion"
},
{
  "pNo": 9,
  "pName": "生产计划",
  "pSuccess": [
    {gname:"cargo", p:'成品', inclose: true,t:"sCargo" },
    {gname:"uName", p:'计划名称', t:"h3" },
    {gname:"title", p:'计划简述',t:"p" },
    {gname:"afamily", p:'计划周期',inclose: true,t:"arrsel", aList:['3年','每年','半年','每季','每月','每日'] },
    {gname:"thumbnail", p:'图片',t: "thumb" },
    {gname:"assetArr", p:'生产用固定资产', t:"assetarray",inclose:true },
    {gname:"dOutput", p:'计划产量', t:"dg" },
    {gname:"rawStocks", p:'原材料', t:"stockArr",inclose:true },
    {gname:"startTime", p:'起点时间', t:"datetime" },
    {gname:"pPlan", p:['开始点(24时制)','计划进度(%)'], t:"table",inclose:true }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由营销条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "sFinallyRole": "11",
  "pModle": "prodesign"
}
]
