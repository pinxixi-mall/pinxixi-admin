
import React from "react";
import { UserOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import Login from "@/views/login/login";
import Home from "@/views/home/home";
import HomeBanner from "@/views/productManage/homeBanner";
import HomeRecommend from "@/views/productManage/homeRecommend";
import UserInfo from "@/views/user/userInfo";
import RecommendEdit from "@/views/productManage/homeRecommend/recommendEdit/recommendEdit";

export interface routeType {
  path: string;
  name: string;
  meta?: {
    title: string,
    icon?: any,
    hideMenu?: boolean
  };
  render?: Function;
  component?: React.FC;
  routes?: Array<routeType>;
  children?: Array<routeType>;
  isShowMenu?: boolean;
}

const defaultRoutes: Array<routeType> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录页'
    },
    component: Login
  },
  // { // 重定向一定要放最后
  //   path: '/',
  //   name: 'index',
  //   render: () => <Redirect to="/home"/>
  // }
]

// 左侧菜单
const navMenus: Array<routeType> = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      icon: <HomeOutlined />
    },
    component: Home
  },
  {
    path: '/product-manage',
    name: 'product-manage',
    meta: {
      title: '商品管理',
      icon: <ShopOutlined />
    },
    routes: [
      {
        path: '/product-manage/home-banner',
        name: 'home-banner',
        meta: {
          title: '首页轮播'
        },
        component: HomeBanner
      },
      {
        path: '/product-manage/home-recomend',
        name: 'home-recomend',
        meta: {
          title: '首页推荐'
        },
        component: HomeRecommend
      },
      {
        path: '/product-manage/home-recomend/recommend-edit',
        name: 'recommend-edit',
        meta: {
          title: '编辑',
          hideMenu: true
        },
        component: RecommendEdit
      },
    ]
  },
  {
    path: '/user-center',
    name: 'user-center',
    meta: {
      title: '个人中心',
      icon: <UserOutlined />
    },
    routes: [
      {
        path: '/user-center/user-info',
        name: 'user-info',
        meta: {
          title: '个人资料'
        },
        component: UserInfo
      }
    ]
  }
]


export {
  defaultRoutes,
  navMenus
}