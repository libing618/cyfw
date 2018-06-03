var mGoods = getApp().mData.goods;
var aGoods = getApp().aData.goods;
const droneId = [
  {masterId:'538112995',slaveId:["537171958","538372606","537119770","538372607","538372608","538372609","538372610","537071274","537119772","538372611","537119773","537119771","538372612","537119774","537119763","538372742","538372614"]},
  {masterId:'538071212',slaveId: ['538097835',"538071219","538071218","538098058","538370950","538071214","538071223","538370966","538071215","538071221","538370957","538071217","538071222","538370965","538372648","538370961","538097834","538071216","538071224","538097833","538071213"]},
  {masterId:'538104511',slaveId:["537098262","538117568","537094815","538106088"]},
  {masterId:'537876982',slaveId:["538111385","538073833","538114761","538114767","538073832","538073852","538101902","538073834","537876973","537898715","538073835","538073843","538111370","538073844","538114790","537877015","538371743","538114787","538073895"]},
  {masterId:'538372764',slaveId:["538372767","538372766","538372765"]}
];
module.exports = {
  droneId: droneId,
  master:{
  "538112995": { uName: '保健食品', title: '保健食品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/75ffd8141fbeafae5817.png'},
  "538071212": { uName: '滋补特产', title: '食品/茶叶/特产/滋补品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/b7eedcd147e0dd58ff3c.png'},
  "538104511": { uName: '营养辅食', title: '奶粉/辅食/营养品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/cce2406ff9e41aa6513f.png'},
  "537876982": { uName: '户外装备', title: '户外运动/登山野营/旅行装备', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/9d8d2efae440d77311b7.png'},
  "538372764": { uName: '旅游出行', title: '旅游出行', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/a6d87c3035b5f80cc222.png'}
  },
  slave:{
"537171958": { uName: '保健饮品', title: '保健饮品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/74a25481405fd7b8845c.png'},
"538372606": { uName: '蛋白质', title: '蛋白质/氨基酸', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/fba65c9b26707b9b83a4.png'},
"537119770": { uName: '冬虫夏草', title: '冬虫夏草', thumbnail: 'http://lc-Trce3aqb.cn-n1.lcfile.com/fad3dd557b4c05a975a6.png' },
"538372607": { uName: '动物精华', title: '动物精华/提取物', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/6b3b98f52db049bd4033.png'},
"538372608": { uName: '营养补充', title: '功能复合型膳食营养补充剂', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/861fb022aa47a774da6d.png'},
"538372609": { uName: '海洋生物', title: '海洋生物类', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/0e837b0ad6acd36856e8.png'},
"538372610": { uName: '菌菇', title: '菌/菇/微生物发酵', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/993f8b77a6d53dea4c66.png'},
"537071274": { uName: '鹿茸', title: '鹿茸', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/c90f49b317078db91d98.png'},
"537119772": { uName: '三七', title: '三七', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/9b3d1d6f5629cea89b07.png'},
"538372611": { uName: '膳食纤维', title: '膳食纤维/碳水化合物', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/fbc77c6efeaca8d2849f.png'},
"537119773":{uName:'山药',title:'山药',thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/5b4f6ea7b552daf16274.png'},
"537119771":{uName:'石斛枫斗',title:'石斛/枫斗',thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/f177b7a1047d4ca50d10.png'},
"538372612": { uName: '维生素', title: '维生素/矿物质', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/03e029dc80802e34cebc.png'},
"537119774": { uName: '新资源', title: '新资源食品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/c738c682145f53ea7ae3.png'},
"537119763": { uName: '雪蛤林蛙', title: '雪蛤干/林蛙油', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/4a11054d11a26722569a.png'},
"538372742": { uName: '滋补品', title: '人参/蜂产品/滋补品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/b84de536e403be76f336.png'},
"538372614": { uName: '植物精华', title: '植物精华/提取物', thumbnail: 'http://lc-Trce3aqb.cn-n1.lcfile.com/54d9dcf1e916acbff377.png' },
"538111385": { uName: '冲浪滑水', title: '冲浪/滑水/帆板', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/79a780173bd0456b565a.png'},
"538073833": { uName: '垂钓用品', title: '垂钓用品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/2a8d75ee6785c32a5a7c.png'},
"538114761": { uName: '刀具工具', title: '刀具/多用工具', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/cfc8c91fa9730773f178.png'},
"538114767": { uName: '防护救生', title: '防护/救生设备', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/2ed3d42fb571057f4cb6.png'},
"538073832": { uName: '服饰配件', title: '服饰配件', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/36ddb94c7e55ad376c57.png'},
"538073852": { uName: '滑雪装备', title: '滑雪装备', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/629bcfccbd60ace57788.png'},
"538101902": { uName: '户外包', title: '户外包/登山包/旅行包', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/221b45dbbb6360900163.png'},
"538073834": { uName: '户外服装', title: '户外服装', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/cb0e2803a8af45f805dc.png'},
"537876973": { uName: '户外军品', title: '户外军品专区', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/e03057a27ef3a2fcc721.png'},
"537898715": { uName: '露营野炊', title: '户外露营/野炊装备', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/7ce6b83e0e258fc724ce.png'},
"538073835": { uName: '户外鞋袜', title: '户外鞋袜', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/081bdb2fb213be1d76a0.png'},
"538073843": { uName: '攀岩攀冰', title: '攀岩/攀冰', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/89f076fde43c950e3c45.png'},
"538111370": { uName: '潜水装备', title: '潜水装备', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/36f7a1e4a0c4820bbd3f.png'},
"538073844": { uName: '水上用品', title: '水上用品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/c3677f7a0e33aed71dde.png'},
"538114790": { uName: '通讯导航', title: '通讯/导航/户外表类', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/b140074d67aa9c6ce7ad.png'},
"537877015": { uName: '望远眼镜', title: '望远镜/眼镜', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/efe2415a2a5ce24b57a8.png'},
"538371743": { uName: '饮水用具', title: '饮水用具/盛水容器', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/795cd8e396670c8e2c29.png'},
"538114787": { uName: '照明工具', title: '照明工具', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/100ab75e3e8f6757f447.png'},
"538073895": { uName: '自行车', title: '自行车', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/8815268a2cf2c72b278a.png'},
"538372767": { uName: '旅游路线', title: '旅游路线', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/c1e664d0cedf4af56ad5.png'},
"538372766": { uName: '旅游信息', title: '旅游信息', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/688e60dfd592beb40fa6.png'},
"538372765": { uName: '票务', title: '票务', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/f466241da76210834f42.png'},
"537098262": { uName: '调味品', title: '酱油/拌饭料/婴幼儿调味品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/20deca7a9811f41e378f.png'},
"538117568": { uName: '营养品', title: '牛初乳/维生素/婴幼儿营养品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/02142a135551671c7f26.png'},
"537094815": { uName: '糖果零食', title: '糖果/泡芙/奶酪/零食', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/d08e84a26f838a15aace.png'},
"538106088": { uName: '婴幼奶粉', title: '婴幼儿奶粉', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/1da7b99972885a165101.png'},
"538071219": { uName: '膨化食品', title: '饼干/糕点/膨化食品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/e04f16d04f8c459cb159.png'},
"538071218": { uName: '茶叶花茶', title: '茶叶/普洱/花草茶', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/384336186e9c77fae4c9.png'},
"538098058": { uName: '烘培原料', title: '调味品/烘培原料', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/d71cde591a082b31c463.png'},
"538370950": { uName: '方便速食', title: '方便速食/罐头', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/338e3e89653cea737f38.png'},
"538071214": { uName: '饮料', title: '果汁/饮料/牛奶制品', thumbnail: 'http://lc-Trce3aqb.cn-n1.lcfile.com/4208712dbb6cb150e52f.png' },
"538071223": { uName: '海味零食', title: '海味零食/鱿鱼丝', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/92ae6711d5657f3a18d5.png'},
"538370966":{ uName: '海鲜制品', title:'海鲜/水产品/制品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/57b03a9fcf7ed5a523dd.png'},
"538071215": { uName: '酒类制品', title: '酒类制品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/0750cb349bc1fc90094a.png'},
"538071221": { uName: '坚果蜜饯', title: '蜜饯/果脯/坚果/炒货', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/509b4005a6de144005bf.png'},
"538370957": { uName: '肉类干货', title: '南北干货/肉类干货', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/3f155520ed41d36d069d.png'},
"538071217": { uName: '冲饮品', title: '藕粉/麦片/天然粉/冲饮品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/7a960073ab77deaf7d52.png'},
"538071222": { uName: '肉类零食', title: '肉类零食/牛肉干/豆腐干', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/ba9e1eb1190600540a14.png'},
"538370965": { uName: '生肉制品', title: '生肉/肉制品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/97f78ad835d7d4316f7f.png'},
"538372648": { uName: '提货券', title: '食品提货券', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/477a9cc0b072b7fcd598.png'},
"538370961": { uName: '熟食凉菜', title: '熟食/凉菜/私房菜', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/d9b6034ebb52eab3519e.png'},
"538097834": { uName: '水果蔬菜', title: '水果蔬菜/蔬菜制品/食用菌', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/971cf263e4a6eddf6039.png'},
"538071216": { uName: '咖啡', title: '速溶咖啡/咖啡豆/粉', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/b942359fcb156a0aa6e5.png'},
"538071224": { uName: '糖果果冻', title: '糖果/果冻/巧克力', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/f627844f1e6f25a03f07.png'},
"538097833": { uName: '蛋类制品', title: '新鲜蛋类/蛋制品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/3dd1e8bd1987884cbaad.png'},
"538071213": { uName: '滋补品', title: '燕窝/人参/蜂产品/滋补品', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/45d5f3e8315549885fbf.png'},
"538097835": { uName: '米面粮油', title: '油/米/面粉/杂粮', thumbnail:'http://lc-Trce3aqb.cn-n1.lcfile.com/0aea7555da773fa195ad.png'}
},
goodsIndex: function(that){
  let gPage = {},slaveData;
  droneId.forEach(ms=>{
    ms.slaveId.forEach(sId=>{
      slaveData = mGgoods.filter(goodsId=> {return aGoods[goodsId].goodstype==sId});
      if (slaveData.length>0) {gPage[sId]=slaveData}
    })
  })
  that.setData({
    goodsPage: gPage,
    pageData: aGoods
  })
}

}
