import React from 'react';
import ReactDOM from 'react-dom';
import '@/style/index.less';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { Provider } from 'mobx-react'
import stores from './store'

ReactDOM.render(
  // <React.StrictMode>
    <Provider {...stores}>
      <App />
    </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
