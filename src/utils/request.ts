import Axios from "axios";
import { isObject, isNull } from "@/utils/tools";
import { getToken, setToken } from "@/utils/utils";
import {
  BASEURL,
  NOT_LOGIN,
  TIMEOUT,
  MOCK_BASE_URL,
  TOKEN_EXPIRED,
} from "@/config/api";
import { message, Modal } from "antd";
import { showLoading, hideLoading} from './loading'

class httpRequest {
  options: any;
  queue: any;
  constructor() {
    this.options = {
      method: "",
      url: "",
    };
    // 存储请求队列
    this.queue = {};
  }

  // 创建实例
  create(options: any) {
    let baseURL = options.baseUrl ? options.baseUrl : BASEURL;
    if (options.isMock) {
      baseURL = MOCK_BASE_URL;
    }
    delete options.isMock;
    let conf = {
      baseURL,
      timeout: TIMEOUT,
      responseType: options.responseType || "json",
      withCredentials: true,
      headers: {
        "Content-Type":
          options.headers && options.headers.contentType
            ? options.headers.contentType
            : "application/json; charset=utf-8",
      },
    };
    return Axios.create(conf);
  }

  // 销毁请求实例
  destroy(url: string) {
    delete this.queue[url];
    const queue = Object.keys(this.queue);
    return queue.length;
  }

  interceptors(instance: any, options: any) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: any) => {
        const token = getToken();
        !options.noLoading && showLoading()
        if (!isNull(token)) {
          config.headers.authorization = `Bearer ${token}`;
        } else {
          config.headers && delete config.headers.authorization;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use(
      (res: any) => {
        hideLoading()
        if (options.isUnCheck) {
          return {
            msg: "",
            code: 20000,
            data: res,
          };
        }

        let { data = {} } = res;
        if (data && data.code !== 200) {
          if (data.code === NOT_LOGIN) {
            setToken(null);
            Modal.warning({
              title: "请登录后再进行操作",
              onOk() {
                const hash = window.location.hash
                const path = hash ? `#/login?redirect=${hash}` : '#/home'
                window.location.replace(path)
              },
            });
          } else if (data.code === TOKEN_EXPIRED) {
            setToken(null);
            Modal.warning({
              title: "登录状态已失效，请重新登录",
              onOk() {
                const hash = window.location.hash.substr(1)
                const path = hash ? `#/login?redirect=${hash}` : '#/home'
                window.location.replace(path)
              },
            });
          } else if (data.code === 400) {
            message.error("请求数据校验不通过");
          } else {
            message.error(data.msg || "请求异常");
          }
          // 只要不等于 200 都是返回error
          return Promise.reject(res.data);
        }
        return data;
      },
      (error: any) => {
        hideLoading()
        let err = {
          code: -1,
          msg: "请求异常",
          data: {},
        };
        if (options.isUnCheck) {
          err.msg = error.message;
          err.data = error;
        }

        if (error.code === "ECONNABORTED") {
          err.msg = "网络繁忙，请稍后再试";
        }
        if (
          error.response &&
          error.response.status &&
          error.response.status === 404
        ) {
          err.msg = "路径地址不正确";
        }
        if (
          error.response &&
          error.response.status &&
          error.response.status === 400
        ) {
          let strMsg = [];
          let errData = error.response.data && error.response.data.data;
          if (errData && isObject(errData)) {
            for (let errKey in errData) {
              strMsg.push(errData[errKey]);
            }
          }
          err.msg = strMsg.join("；") || "请求参数不合法";
        }

        message.error(err.msg);
        return Promise.reject(err);
      }
    );
  }

  // 请求实例
  request(method: string, url: string, data: any, options: any, paramsType?: string) {
    options = Object.assign({}, options);
    paramsType = paramsType || 'data';
    options[paramsType] = data;
    options.method = method;
    options["url"] = url;
    const instance = this.create(options);
    this.interceptors(instance, options);
    // options = Object.assign({}, options);
    this.queue[options.url] = instance;
    return instance(options);
  }

  // get请求实例
  get(url: string, params: any, options?: any) {
    return this.request('GET', url, params, options, 'params')
  }

  // post请求实例
  post(url: string, data: any, options?: any) {
    return this.request('POST', url, data, options)
  }

  // put请求实例
  put(url: string, data: any, options?: any) {
    return this.request('PUT', url, data, options)
  }

  // delete请求实例
  delete(url: string, data: any, options?: any) {
    return this.request('DELETE', url, data, options)
  }
}

export default new httpRequest();
