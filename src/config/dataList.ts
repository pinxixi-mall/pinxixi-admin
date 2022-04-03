/**
 * 商品类型
 */
export const goodsTypeList = [
  { label: "普通商品", value: 1 },
  { label: "推荐商品", value: 2 },
]

/**
 * 商品状态
 */
export const goodsStatusList = [
  { label: "已下架", value: 0 },
  { label: "销售中", value: 1 },
]

/**
 * 商品分类级别
 */
export const goodsCategoryLevelList = [
  { label: "一级分类", value: 1 },
  { label: "二级分类", value: 2 },
  { label: "三级分类", value: 3 },
]

/**
 * 订单状态
 */
export const orderStatuslList = [
  { label: "待支付", value: 0 },
  { label: "待收货", value: 1 },
  { label: "交易成功", value: 2 },
  { label: "手动关闭", value: 3 },
  { label: "超时关闭", value: 4 },
  { label: "商家关闭", value: 5 },
  { label: "已删除", value: 99 },
]

/**
 * 支付状态
 */
export const paymentStatuslList = [
  { label: "待支付", value: 0 },
  { label: "支付成功", value: 1 },
  { label: "支付失败", value: 2 },
]

/**
 * 支付方式
 */
export const paymentTypelList = [
  { label: "支付宝", value: 1 },
  { label: "微信", value: 2 },
]