import { observable, computed, action, makeObservable } from 'mobx'

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

const stores = {
  LayoutStore: new LayoutStore()
}

export default stores