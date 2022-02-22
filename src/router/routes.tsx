
import React from "react";
import { UserOutlined, HomeOutlined, ShopOutlined, AppstoreOutlined, OrderedListOutlined   } from '@ant-design/icons';
import Login from "@/views/login";
import Dashboard from "@/views/dashboard";
import HomeBanner from "@/views/homeManage/homeBanner";
import HomeRecommend from "@/views/homeManage/homeRecommend";
import UserInfo from "@/views/userManage/userInfo";
import RecommendEdit from "@/views/homeManage/homeRecommend/edit";
import ProductCategory from "@/views/categoryManage/productCategory";
import AllOrder from "@/views/orderManage/allOrder";
import NotFound from '@/views/404';
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

// 非菜单路由
const otherRoutes: Array<routeType> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: Login
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: 'not found'
    },
    component: NotFound
  },
]

// 左侧菜单路由
const navRoutes: Array<routeType> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      icon: <HomeOutlined />
    },
    component: Dashboard
  },
  {
    path: '/home-manage',
    name: 'home-manage',
    meta: {
      title: '首页管理',
      icon: <ShopOutlined />
    },
    routes: [
      {
        path: '/home-manage/home-banner',
        name: 'home-banner',
        meta: {
          title: '首页轮播'
        },
        component: HomeBanner
      },
      {
        path: '/home-manage/home-recomend',
        name: 'home-recomend',
        meta: {
          title: '首页推荐'
        },
        component: HomeRecommend
      },
      {
        path: '/home-manage/recommend-edit',
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
    path: '/category-manage',
    name: 'category-manage',
    meta: {
      title: '分类管理',
      icon: <AppstoreOutlined />
    },
    routes: [
      {
        path: '/category-manage/product-category',
        name: 'product-category',
        meta: {
          title: '商品分类'
        },
        component: ProductCategory
      }
    ]
  },
  {
    path: '/order-manage',
    name: 'order-manage',
    meta: {
      title: '订单管理',
      icon: <OrderedListOutlined />
    },
    routes: [
      {
        path: '/order-manage/all-order',
        name: 'all-order',
        meta: {
          title: '所有订单'
        },
        component: AllOrder
      }
    ]
  },
  {
    path: '/user-manage',
    name: 'user-manage',
    meta: {
      title: '用户管理',
      icon: <UserOutlined />
    },
    routes: [
      {
        path: '/user-manage/user-info',
        name: 'user-info',
        meta: {
          title: '个人信息'
        },
        component: UserInfo
      }
    ]
  },
]


export {
  otherRoutes,
  navRoutes
}