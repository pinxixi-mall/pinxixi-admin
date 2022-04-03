import { observable, computed, action, makeObservable } from 'mobx'

/**
 * 布局信息
 */
class LayoutStore {
  // 面包屑
  breadcrumb: string[] = []
  // 左侧展开的菜单
  openKeys: string[] = []

  get getBreadcrumb(): any {
    return this.breadcrumb
  }

  // 设置面包屑
  setBreadcrumb (data: Array<string>): void {
    console.log(data);
    
    this.breadcrumb = data
  }

  // 设置左侧菜单展开
  setOpenKeys (data: Array<string>) {
    this.openKeys = data
  }

  constructor() {
    makeObservable(this, {
      breadcrumb: observable,
      getBreadcrumb: computed,
      setBreadcrumb: action,

      openKeys: observable,
      setOpenKeys: action
    })
  }
}

/**
 * 用户信息
 */
class UserInfoStore {
  info: object | null = null
  
  get getInfo(): object | null {
    return this.info
  }

  setInfo(data: object | null) {
    this.info = data
  }

  constructor() {
    makeObservable(this, {
      info: observable,
      getInfo: computed,
      setInfo: action,
    })
  }
}

const stores = {
  LayoutStore: new LayoutStore(),
  UserInfoStore: new UserInfoStore()
}

export default stores