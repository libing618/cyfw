module.exports = {
issue_apply:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"发行方渠道编号",gname:"channel_id",t:"String",len:16},
  {p:"原资产唯一ID",gname:"source_id",t:"String",len:16},
  {p:"持有方帐户",gname:"owner_account",t:"String",len:64},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"资产份额",gname:"amount",t:"int"},
  {p:"资产单位",gname:"unit",t:"String",len:32},
  {p:"资产内容",gname:"content",t:"JSON"}
],
issue_submit:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"交易ID",gname:"transaction_id",t:"String",len:32},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"签名列表",gname:"sign_list",t:"String"}
],
transfer_apply:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"资产转出帐户",gname:"src_account",t:"String",len:64},
  {p:"资产转入帐户",gname:"dst_account",t:"String",len:64},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"转让份额",gname:"amount",t:"int"},
  {p:"要求签收时间",gname:"sign_in_date",t:"datetime"},
  {p:"扩展信息",gname:"extra_info",t:"JSON"}
],
transfer_sign:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"交易ID",gname:"transaction_id",t:"String",len:32},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"操作类型",gname:"op_code",t:"Int"},
  {p:"签名列表",gname:"sign_list",t:"String"}
],
transfer_submit:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"交易ID",gname:"transaction_id",t:"String",len:32},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"签名列表",gname:"sign_list",t:"String"}
],
settle_apply:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"持有方帐户",gname:"owner_account",t:"String",len:64},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"份额",gname:"amount",t:"int"},
  {p:"扩展信息",gname:"extra_info",t:"JSON"}
],
settle_submit:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"交易ID",gname:"transaction_id",t:"String",len:32},
  {p:"资产类型",gname:"asset_type",t:"int"},
  {p:"签名列表",gname:"sign_list",t:"String"}
],
account_query:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"用户ID",gname:"owner_uid",t:"String",len:64},
  {p:"资产帐户",gname:"asset_account",t:"String",len:64},
  {p:"状态",gname:"state",t:"int"},
  {p:"查询条数",gname:"page_limit",t:"Int"},
  {p:"页数",gname:"page_no",t:"int"}
],
trans_query:[
  {p:"账本ID",gname:"ledger_id",t:"String",len:32},
  {p:"发起方",gname:"src_account",t:"String",len:64},
  {p:"接收方",gname:"dst_account",t:"String",len:64},
  {p:"交易ID",gname:"transaction_id",t:"String",len:32},
  {p:"交易类型",gname:"trans_type",t:"int"},
  {p:"状态",gname:"state",t:"int"},
  {p:"查询条数",gname:"page_limit",t:"Int"},
  {p:"页数",gname:"page_no",t:"int"}
]
}
