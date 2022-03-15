import http from '@/utils/request';

// 登录
export const login = (data?: any) => {
  return http.post(`/admin/login`, data);
};

// 退出登录
export const logout = () => {
  return http.post(`/admin/logout`);
};

// 用户信息
export const getUserInfo = () => {
  return http.get(`/admin/userInfo`);
};

// 轮播图列表
export const getHomeCarousel = (data?: any, options?: any) => {
  return http.get(`/admin/home-manage/carousels`, data, options);
};

// 首页轮播图新增
export const addHomeCarousel = (data?: any) => {
  return http.post(`/admin/home-manage/carousels`, data);
};

// 首页轮播图更新（修改、上下架、删除）
export const updateHomeCarousel = (data?: any) => {
  return http.put(`/admin/home-manage/carousels`, data);
};

// 首页推荐列表
export const getRecommends = (data?: any, options?: any) => {
  return http.get(`/admin/home-manage/recommend`, data, options);
};

// 首页推荐新增
export const addRecommend = (data?: any) => {
  return http.post(`/admin/home-manage/recommend`, data);
};

// 首页推荐编辑
export const updateRecommend = (data?: any) => {
  return http.put(`/admin/home-manage/recommend`, data);
};

// 首页推荐删除
export const deleteRecommend = (id?: number) => {
  return http.delete(`/admin/home-manage/recommend/${id}`);
};

// 商品列表
export const getGoods = (data?: any, options?: any) => {
  return http.get(`/admin/goods-manage/goods/list`, data, options);
};

// 商品新增
export const addGoods = (data?: any, options?: any) => {
  return http.post(`/admin/goods-manage/goods`, data, options);
};

// 商品修改
export const updateGoods = (data?: any, options?: any) => {
  return http.put(`/admin/goods-manage/goods`, data, options);
};

// 商品状态修改
export const updateGoodsStatus = (data?: any, options?: any) => {
  return http.put(`/admin/goods-manage/goods/status`, data, options);
};

// 删除商品
export const deleteGoods = (goodsId: number) => {
  return http.delete(`/admin/goods-manage/goods/${goodsId}`);
};

// 商品详情
export const goodsDetial = (goodsId: number) => {
  return http.get(`/admin/goods-manage/goods/${goodsId}`);
};

// 商品分类列表
export const getGoodsCategorys = (data?: any, options?: any) => {
  return http.get(`/admin/goods-manage/category/list`, data, options);
};

// 新增商品分类
export const addGoodsCategory = (data?: any, options?: any) => {
  return http.post(`/admin/goods-manage/category`, data, options);
};

// 修改商品分类
export const updateGoodsCategory = (data?: any, options?: any) => {
  return http.put(`/admin/goods-manage/category`, data, options);
};

// 删除商品分类
export const deleteGoodsCategory = (id: number) => {
  return http.delete(`/admin/goods-manage/category/${id}`);
};

// 根据级别查询商品分类
export const getGoodsCategoryByLevel = (data: any) => {
  return http.get(`/admin/goods-manage/category/level`, data);
};

// 订单列表
export const getOrders = (data: any) => {
  return http.get(`/admin/order-manage/order/list`, data);
};

// 订单列表
export const updateOrder = (data: any) => {
  return http.post(`/admin/order-manage/order`, data);
};

// 公共上传
export const commonUpload = (data?: any) => {
  return http.post(`/admin/upload/file`, data, {
    header: { "Content-Type": `application/x-www-form-urlencoded` },
  });
};
