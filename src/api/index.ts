import http from "@/utils/request";

// 登录
export const login = (data?: any) => {
  return http.post("/admin/login", data);
};

// 退出登录
export const logout = () => {
  return http.post("/admin/logout");
};

// 用户信息
export const getUserInfo = () => {
  return http.get("/admin/userInfo");
};

// 轮播图列表
export const getHomeCarousel = (data?: any, options?: any) => {
  return http.get("/admin/home-manage/carousels", data, options);
};

// 首页轮播图新增
export const addHomeCarousel = (data?: any) => {
  return http.post("/admin/home-manage/carousels", data);
};

// 首页轮播图更新（修改、上下架、删除）
export const updateHomeCarousel = (data?: any) => {
  return http.put("/admin/home-manage/carousels", data);
};

// 首页推荐列表
export const getRecommends = (data?: any, options?: any) => {
  return http.get("/admin/home-manage/recommends", data, options);
};

// 首页推荐新增、编辑
export const updateRecommend = (data?: any) => {
  return http.post("/admin/home-manage/recommends", data);
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
  return http.post("/admin/upload/file", data, {
    header: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
