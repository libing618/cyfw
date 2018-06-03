//gname为字段名称，p为显示的没字名，t为编辑类型，css为存储和显示类型
//csc对应关系:aslist行业数组选择，存储{code:代码数组，sName:代码对应值的数组}
//csc对应关系:arrsel数组选择，存储{code:选择值，sName:选择对应的值}
//csc对应关系:objsel对象选择，存储gname对应数据表选择的ID值，显示slave对应uName:选择记录的名称，title:选择记录的简介，thumbnail:选择记录的缩略图}
//csc对应关系:specsel对象选择，存储gname对应数据表选择的ID值，显示slave对应要素及carga要素
//csc对应关系:idsel数组选择，存储gname对应数据表选择的ID值，显示选择对应的app.aData[gname].uName
//csc对应关系:t:"dg"为数据型,csc的digit代表2位小数点浮点数，number则为整数型
module.exports = {
"_Role":{
  "pName": "单位名称和负责人",
  "pSuccess": [
    {gname:"afamily", p:'厂商类型', inclose:false,t:"listsel", aList:['产品制造人','物流服务人','电商服务站','生产厂家','电子商务企业']},
    {inclose:true, gname:"indType", p:'主营业务', t:"industrytype", csc:"aslist" },
    {gname:"nick", p:'单位简称',t:"h2" },
    {gname: "title", p:'单位简介', t:"h3"},
    {gname: "desc", p: '单位描述', t: "p"},
    {gname: "thumbnail", p: '图片简介', t: "cutImageThumbnail" },
    {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
    {gname: "address", p: '地址', t: "modalEditAddress"},
    {gname: "sUnit", p: '服务单位', t: "mapSelectUnit", indTypes: 620406 },
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
  "pModel": "_Role"
},
"articles":{
  "pName": "文章",
  "afamily": ['公告公示','品牌建设','扶持优惠','产品宣传','常见问题'],
  "pSuccess": [
    {gname:"title",t:"h2", p:"标题" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "cutImageThumbnail" },
    {gname:"desc", t:"p", p:"摘要" },
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
  "pModel": "articles"
},
"asset":{
  "pName": "固定资产",
  "pSuccess": [
    {inclose:true, gname:"assetType", p:'固定资产类别',t:"assettype", csc:"arrsel"},
    {gname:"title", p:'固定资产简介',t:"h3" },
    {gname:"desc", p:'固定资产描述',t:"p" },
    {gname:"aGeoPoint", p:'地理位置',t:"chooseAd" },
    {gname:"address", p: '详细地址', t: "modalEditAddress"},
    {gname:"thumbnail", p: '图片简介',t: "cutImageThumbnail" },
    {gname:"fcode", p: '编号',t: "inScan" },
    {gname:"manageName", p:'管理人姓名', t:"h4" },
    {gname:"managePhone", p:'管理人电话', t:"h4" }
  ],
  "pBewrite": "综合条线提出固定资产设置或修改申请，由条线负责人进行审批。",
  "puRoles": [
    "32",
    "31"
  ],
  "pModel": "asset"
},
"product":{
  "pName": "产品",
  "pSuccess": [
    {inclose: true, gname:"protype", p:'产品类别',t:"producttype",  csc:"arrsel" },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"cutImageThumbnail" },
    {gname:"aGeoPoint", p:'出厂位置', t: "chooseAd" },
    {gname:"address", p:'产地', t: "modalEditAddress" },
    {gname:"PARM_content", p:'内容', t:"h4" },
    {gname:"PARM_additive", p:'附加', t:"h4" },
    {gname:"PARM_attention", p:'注意事项', t:"h4" },
    {gname:"PARM_period", p:'期限(天)', t:"dg",csc:"digit" },
    {gname:"standard_code", p:'执行标准', t:"h4" },
    {gname:"license_no", p:'许可证号', t:"h4" },
    {gname:"surface", p:'外观范围', t:"arrList",inclose:true },
    {gname:"size", p:'尺寸范围', t:"arrList",inclose:true },
    {gname:"weight", p:'重量范围', t:"arrList",inclose:true }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "product"
},
"service":{
  "pName": "服务",
  "pSuccess": [
    {gname:"serFamily", p:'服务类型', inclose: true, t:"producttype",  csc:"arrsel"},
    {gname:"title", p:'简介',t:"h4" },
    {gname:"aGeoPoint", p:'服务地位置', t: "chooseAd" },
    {gname:"address", p:'服务地址', t: "modalEditAddress" },
    {gname:"priceClass", p:'计价类型', t: "h3" },
    {gname:"price", p:'价格', t:"dg",csc:"digit" },
    {gname:"serParty", p:'服务方', t:"h4" },
    {gname:"serName", p:'联系人姓名', t:"h4" },
    {gname:"serPhone", p:'联系人电话', t:"h4" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "service"
},
"share":{
  "pName": "共享服务",
  "afamily":['开始','服务','停止'],
  "pSuccess": [
    {gname:"service", p:'服务', t:"sId", csc:"idsel" },
    {gname:"asset", p:'固定资产', t:"sId", csc:"idsel" },
    {gname:"serFamily", p:'服务类型', inclose: true, t:"producttype",  csc:"arrsel"},
    {gname:"title", p:'简介',t:"h4" },
    {gname:"aGeoPoint", p:'服务地位置', t: "chooseAd" },
    {gname:"address", p:'服务地址', t: "modalEditAddress" },
    {gname:"fcode", p: '编号',t: "inScan" },
    {gname:"priceClass", p:'计价类型', t: "h3" },
    {gname:"price", p:'价格', t:"dg",csc:"digit" },
    {gname:"serParty", p:'服务方', t:"h4" },
    {gname:"serName", p:'联系人姓名', t:"h4" },
    {gname:"serPhone", p:'联系人电话', t:"h4" },
    {gname:"manageParty", p:'管理方', t:"h4" },
    {gname:"manageName", p:'管理人姓名', t:"h4" },
    {gname:"managePhone", p:'管理人电话', t:"h4" },
    {gname:"startTime", p:'开始时间', t:"itime",endif:false},
    {gname:"endTime", p:'结束时间', t:"itime",endif:false}
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "share"
},
"cargo":{
  "pName": "成品",
  "pSuccess": [
    {gname:"product", p:'产品', t:"sId", csc:"idsel" },
    {gname:"title", p:'成品简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t: "cutImageThumbnail" },
    {gname:"s_product", p:'外观尺寸重量', t:"arrplus", csc:"arrsel" },
    {gname:"retail_price", p:'零售价', t:"dg",itype:"digit",csc:"digit" },
    {gname:"cargoStock", p:'库存', t:"dg",itype:"number", csc:"canSupply"},
    {gname: "canSupply", p:'可供销售', t: "fg"}
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "cargo"
},
"goods":{
  "pName": "商品",
  "pSuccess": [
    {inclose: true, gname:"goodstype", p:'商品类别',t:"sObject",  csc:"objsel" },
    {gname:"title", p:'简介',t:"h3" },
    {gname:"desc", p:'描述',t:"p" },
    {gname:"specstype", p:'规格类型', inclose:false,t:"listsel", aList:['单品','套餐']},
    {gname:"thumbnail", p:'图片简介',t:"cutImageThumbnail" },
    {gname:"pics", p:'图片集',t:"pics"},
    {gname:"tvidio", p:'视频简介',t: "vidio" },
    {gname: "channel", p:'渠道分成比例%',t:"dg",itype:"digit",csc:"mCost"},
    {gname: "extension", p:'推广分成比例%',t:"dg",itype:"digit",csc:"mCost"},
    {gname: "mCost", p:'销售管理总占比', t: "fg"},
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "suRoles": ["12"],
  "pModel": "goods"
},
 "specs":{
  "pName": "商品规格",
  "pSuccess": [
    {gname:"goods", p:'商品', t:"sId", csc:"idsel" },
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"serFamily", p:'服务类型', inclose:false,t:"listsel", aList:['快递送货','货运自提','柜台提货','店铺消费'] },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"cutImageThumbnail" },
    {gname:"package", p:'含成品数量', t:"dg",csc:"number" },
    {gname:"price", p:'零售价', t:"dg",csc:"digit" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "specs"
},
"promotion":{
  "pName": "众筹团购及促销",
  "afamily":['众筹','团购','促销'],
  "pSuccess": [
    {gname:"specs", p:'商品规格', t:"sId", csc:"idsel" },
    {gname:"base_price", p:'基础优惠价', t:"dg",csc:"digit" },
    {gname:"base_amount", p:'基础目标数量',t:"dg",csc:"number" },
    {gname:"big_price", p:'大额优惠价', t:"dg",csc:"digit" },
    {gname:"big_amount", p:'大额目标数量',t:"dg",csc:"number" },
    {gname:"start_end", p:'活动起止日期', t:"sedate",endif:false}
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由营销条线负责人进行审批。",
  "puRoles": [
    "12",
    "31"
  ],
  "pModel": "promotion"
},
"material":{
  "pName": "原材料与包装",
  "pSuccess": [
    {gname:"title", p:'材料简述',t:"p" },
    {gname:"dafamily", p:'材料类型',inclose:false,t:"listsel", aList:['自产原料','外购原料','包装'] },
    {gname:"thumbnail", p:'图片',t: "cutImageThumbnail" },
    {gname:"rawStocks", p:'原材料库存', t:"dg",csc:"number" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "pModel": "material"
},
"content":{
  "pName": "成品内含原料及包装",
  "pSuccess": [
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"material", p:'材料(包装)', t:"sId",csc:"idsel" },
    {gname:"dOutput", p:'内含数量', t:"dg",csc:"number" },
    {gname:"price", p:'价格预算', t:"dg",csc:"digit"}
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "pModel": "content"
},
"prodesign":{
  "pName": "生产计划",
  "afamily":['原材料供应','加工及包装'],
  "pSuccess": [
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"title", p:'计划简述',t:"h3" },
    {gname:"thumbnail", p:'图片',t: "cutImageThumbnail" },
    {gname:"dOutput", p:'计划产量', t:"dg",csc:"number" },
    {gname:"startDate", p:'开始日期', t:"idate",endif:false},
    {gname:"endDate", p:'结束日期', t:"idate",endif:false}
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "pModel": "prodesign"
},
"wholesale":{
  "pName": "产品批发",
  "pSuccess": [
    {gname:"product", p:'产品', t:"sId", csc:"idsel" },
    {gname:"title", p:'批发品简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t: "cutImageThumbnail" },
    {gname:"s_product", p:'外观尺寸重量', t:"arrplus", csc:"arrsel" },
    {gname:"whole_price", p:'零售价', t:"dg",itype:"digit",csc:"digit" },
    {gname:"wholeStock", p:'库存', t:"dg",itype:"number", csc:"canSupply"},
    {gname: "canwholesale", p:'可供销售', t: "fg"}
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "wholesale"
},
"rawOperate":{
  "pName": "原料采供",
  "oprocess": ['采供下单', '原料供应', '原料入库'],
  "pSuccess": [
    {gname:"material", p:'原料(包装)', t:"sId",csc:"idsel" },
    { gname: "thumbnail", p: '图片', t: "cutImageThumbnail" },
    { gname: "vUnit", p: '供货商', t: "h3", e: '单位名称' },
    { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
  ],
  "pModel": "rawStock",
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity']},
    { indexField: 'material', sumField: ['deliverTotal'] },
    { indexField: 'material', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1,0,0],
  "oBewrite": "产品条线确认采购计划,综合条线采购原料并入库。",
  "oModel": "rawOperate"
},
"packOperate":{
  "pName": "加工入库",
  "oprocess": ['安排生产', '生产加工', '成品入库'],
  "pSuccess": [
    {gname:"cargo", p:'成品',t:"sObject", csc:"objsel" },
    { gname: "thumbnail", p: '图片', t: "cutImageThumbnail" },
    { gname: "vUnit", p: '加工商', t: "h3", e: '单位名称' },
    { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
  ],
  "pModel": "packing",
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity']},
    { indexField: 'cargo', sumField: ['deliverTotal'] },
    { indexField: 'cargo', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1,1,0],
  "oBewrite": "产品条线确认出品计划,产品条线包装并入库。",
  "oModel": "packOperate"
},
"supplies":{
  "pName": "订单处理",
  "oprocess": ['订单确认', '成品出货', '到货确认'],
  "pSuccess": [
    {gname:"cargo", p:'成品',t:"sObject", csc:"objsel" },
    { gname: "thumbnail", p: '图片', t: "cutImageThumbnail" },
    { gname: "vUnit", p: '物流商', t: "h3", e: '单位名称' },
    { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
  ],
  "pModel": "order",
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity']},
    { indexField: 'address', sumField: ['deliverTotal'] },
    { indexField: 'address', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1,1,3],
  "oBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。",
  "oModel": "supplies"
}
}
