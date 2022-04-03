
import React from "react";
import { UserOutlined, HomeOutlined, ShopOutlined, AppstoreOutlined, OrderedListOutlined   } from '@ant-design/icons';
import Login from "@/views/login";
import Dashboard from "@/views/dashboard";
import HomeCarousel from "@/views/homeManage/homeCarousel";
import HomeRecommend from "@/views/homeManage/homeRecommend";
import UserInfo from "@/views/userManage/userInfo";
import GoodsEdit from "@/views/goodsManage/goods/edit";
import GoodsCategory from "@/views/goodsManage/category";
import Goods from "@/views/goodsManage/goods";
import Orders from "@/views/orderManage/orders";
import OrderDetail from "@/views/orderManage/detail";
import NotFound from '@/views/404';
export interface routeType {
  path: string;
  name: string;
  meta?: {
    title: string,
    icon?: any,
    hideMenu?: boolean
  };
  render?(): void;
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
        path: '/home-manage/home-carousel',
        name: 'home-carousel',
        meta: {
          title: '首页轮播'
        },
        component: HomeCarousel
      },
      {
        path: '/home-manage/home-recomend',
        name: 'home-recomend',
        meta: {
          title: '首页推荐'
        },
        component: HomeRecommend
      },
    ]
  },
  {
    path: '/goods-manage',
    name: 'goods-manage',
    meta: {
      title: '商品管理',
      icon: <AppstoreOutlined />
    },
    routes: [
      {
        path: '/goods-manage/goods',
        name: 'goods',
        meta: {
          title: '商品列表'
        },
        component: Goods
      },
      {
        path: '/goods-manage/category',
        name: 'category',
        meta: {
          title: '商品分类'
        },
        component: GoodsCategory
      },
      {
        path: '/goods-manage/goods-edit',
        name: 'goods-edit',
        meta: {
          title: '商品编辑',
          hideMenu: true
        },
        component: GoodsEdit
      },
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
          title: '订单列表'
        },
        component: Orders
      },
      {
        path: '/order-manage/order-detail/:orderId',
        name: 'order-detail',
        meta: {
          title: '订单详情',
          hideMenu: true
        },
        component: OrderDetail
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
          title: '用户信息'
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