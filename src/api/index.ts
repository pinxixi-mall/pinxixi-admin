import { UserInfo } from '@/types';
import http from '@/utils/request';

/**
 * 登录
 * @param data 
 * @returns 
 */
export const login = (data?: any) => {
  return http.post(`/admin/login`, data, { noLoading: true });
};

/**
 * 退出登录
 * @returns 
 */
export const logout = () => {
  return http.post(`/admin/logout`);
};

/**
 * 用户信息
 * @returns 
 */
export const getUserInfo = () => {
  return http.get(`/admin/user`, null, { noLoading: true });
};

/**
 * 修改用户信息
 * @param data 
 * @returns 
 */
export const updateUserInfo = (data: UserInfo) => {
  return http.put(`/admin/user`, data);
};

/**
 * 重置密码
 * @param data 
 * @returns 
 */
export const resetPassword = (data: any) => {
  return http.put(`/admin/user/reset`, data);
};

/**
 * 轮播图列表
 * @param data 
 * @param options 
 * @returns 
 */
export const getHomeCarousel = (data?: any, options?: any) => {
  return http.get(`/admin/home-manage/carousels`, data, options);
};

/**
 * 首页轮播图新增
 * @param data 
 * @returns 
 */
export const addHomeCarousel = (data?: any) => {
  return http.post(`/admin/home-manage/carousels`, data);
};

/**
 * 首页轮播图更新（修改、上下架、删除）
 * @param data 
 * @returns 
 */
export const updateHomeCarousel = (data?: any) => {
  return http.put(`/admin/home-manage/carousels`, data);
};

/**
 * 首页推荐列表
 * @param data 
 * @param options 
 * @returns 
 */
export const getRecommends = (data?: any, options?: any) => {
  return http.get(`/admin/home-manage/recommend`, data, options);
};

/**
 * 首页推荐新增
 * @param data 
 * @returns 
 */
export const addRecommend = (data?: any) => {
  return http.post(`/admin/home-manage/recommend`, data);
};

/**
 * 首页推荐编辑
 * @param data 
 * @returns 
 */
export const updateRecommend = (data?: any) => {
  return http.put(`/admin/home-manage/recommend`, data);
};

/**
 * 首页推荐删除
 * @param id 
 * @returns 
 */
export const deleteRecommend = (id?: number) => {
  return http.delete(`/admin/home-manage/recommend/${id}`);
};

/**
 * 商品列表
 * @param data 
 * @param options 
 * @returns 
 */
export const getGoods = (data?: any, options?: any) => {
  return http.get(`/admin/goods-manage/goods/list`, data, options);
};

/**
 * 商品新增
 * @param data 
 * @param options 
 * @returns 
 */
export const addGoods = (data?: any, options?: any) => {
  return http.post(`/admin/goods-manage/goods`, data, options);
};

/**
 * 商品修改
 * @param data 
 * @param options 
 * @returns 
 */
export const updateGoods = (data?: any, options?: any) => {
  return http.put(`/admin/goods-manage/goods`, data, options);
};

/**
 * 商品状态修改
 * @param data 
 * @param options 
 * @returns 
 */
export const updateGoodsStatus = (data?: any, options?: any) => {
  return http.put(`/admin/goods-manage/goods/status`, data, options);
};

/**
 * 删除商品
 * @param goodsId 
 * @returns 
 */
export const deleteGoods = (goodsId: number) => {
  return http.delete(`/admin/goods-manage/goods/${goodsId}`);
};

/**
 * 商品详情
 * @param goodsId 
 * @returns 
 */
export const goodsDetial = (goodsId: number) => {
  return http.get(`/admin/goods-manage/goods/${goodsId}`);
};

/**
 * 商品分类列表
 * @param data 
 * @param options 
 * @returns 
 */
export const getGoodsCategorys = (data?: any, options?: any) => {
  return http.get(`/admin/goods-manage/category/list`, data, options);
};

/**
 * 新增商品分类
 * @param data 
 * @param options 
 * @returns 
 */
export const addGoodsCategory = (data?: any, options?: any) => {
  return http.post(`/admin/goods-manage/category`, data, options);
};

/**
 * 修改商品分类
 * @param data 
 * @param options 
 * @returns 
 */
export const updateGoodsCategory = (data?: any, options?: any) => {
  return http.put(`/admin/goods-manage/category`, data, options);
};

/**
 * 删除商品分类
 * @param id 
 * @returns 
 */
export const deleteGoodsCategory = (id: number) => {
  return http.delete(`/admin/goods-manage/category/${id}`);
};

/**
 * 查询单个商品分类
 * @param id 
 * @returns 
 */
 export const getGoodsCategory = (id: number) => {
  return http.get(`/admin/goods-manage/category/${id}`);
};

/**
 * 根据级别查询商品分类
 * @param data 
 * @returns 
 */
export const getGoodsCategoryByLevel = (data: any) => {
  return http.get(`/admin/goods-manage/category/level`, data);
};

/**
 * 订单列表
 * @param data 
 * @returns 
 */
export const getOrders = (data: any) => {
  return http.get(`/admin/order-manage/order/list`, data);
};

/**
 * 更新订单
 * @param data 
 * @returns 
 */
export const updateOrder = (data: any) => {
  return http.put(`/admin/order-manage/order`, data);
};

/**
 * 订单详情
 * @param data 
 * @returns 
 */
export const getOrderDetail = (orderId: number) => {
  return http.get(`/admin/order-manage/order/${orderId}`);
};

/**
 * 公共上传
 * @param data 
 * @returns 
 */
export const commonUpload = (data?: any) => {
  return http.post(`/admin/upload/file`, data, {
    header: { "Content-Type": `application/x-www-form-urlencoded` },
  });
};
