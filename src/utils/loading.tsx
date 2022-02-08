import ReactDOM from 'react-dom'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

let loadingCount = 0;
let dom;

const startLoading = () => {
    dom = document.createElement('div')
    dom.setAttribute('id', 'loading-box')
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="loading..." indicator={antIcon} />, dom)
};

const endLoading = () => {
  const loading = document.getElementById('loading-box')
  loading &&  document.body.removeChild(loading)
};

export const showLoading = () => {
    if (loadingCount === 0) {
        startLoading();
    }
    loadingCount += 1;
};

export const hideLoading = () => {
    if (loadingCount <= 0) {
        return;
    }
    loadingCount -= 1;
    if (loadingCount === 0) {
        endLoading();
    }
}