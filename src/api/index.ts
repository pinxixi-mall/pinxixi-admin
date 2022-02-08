import http from "@/utils/request";

// 登录
export const login = (data?: any) => {
  return http.post("/admin/login", data);
};

// 退出登录
export const logout = (data?: any) => {
  return http.post("/admin/logout", data);
};

// 轮播图列表
export const getHomeBanner = (data?: any, options?: any) => {
  return http.get("/admin/getHomeBanner", data, options);
};

// 首页轮播图新增/修改
export const updateHomeBanner = (data?: any) => {
  return http.post("/admin/updateHomeBanner", data);
};

// 首页轮播图上、下架
export const updateBannerStatus = (data?: any) => {
  return http.post("/admin/updateBannerStatus", data);
};

// 首页轮播图删除
export const deleteBanner = (data?: any) => {
  return http.delete("/admin/deleteBanner", data);
};

// 首页推荐列表
export const getRecommendList = (data?: any, options?: any) => {
  return http.get("/admin/recommendList", data, options);
};

// 首页推荐新增、编辑
export const updateRecommend = (data?: any) => {
  return http.post("/admin/updateRecommend", data);
};

// 首页推荐详情
export const recommendDetail = (data?: any) => {
  return http.get("/admin/recommendDetail", data);
};

// 首页推荐删除
export const deleteRecommend = (data?: any) => {
  return http.delete("/admin/deleteRecommend", data);
};

// 公共上传
export const commonUpload = (data?: any) => {
  return http.post("/common/upload", data, {
    header: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
