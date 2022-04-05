// 未登录
export const NOT_LOGIN = 401

// token失效
export const TOKEN_EXPIRED = 403

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'api' : 'api'

// 项目模拟地址
export const MOCK_BASE_URL = ''

// 请求超时时间 10秒
export const TIMEOUT = 100000
