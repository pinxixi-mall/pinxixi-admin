
import Home from "@/views/home/home";
import HomeBanner from "@/views/productManage/homeBanner";
import HomeRecommend from "@/views/productManage/homeRecommend";
import { UserOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import type { routeType } from '@/router/routes'

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
        component: HomeBanner
      }
    ]
  }
]

export default navMenus