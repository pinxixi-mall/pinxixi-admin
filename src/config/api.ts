// 未登录
export const NOT_LOGIN = 4002

// token失效
export const TOKEN_EXPIRED = 4001

export const BASEURL = process.env.NODE_ENV === 'development' ? 'api' : ''

// 项目模拟地址
export const MOCK_BASE_URL = ''

// 请求超时时间 10秒
export const TIMEOUT = 100000
