import React, { FC } from 'react'
import { PageHeader, Button } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { BodyCardProps } from '@/types'
import styles from './index.module.less'
const { useHistory } = require('react-router-dom')

const BodyCard: FC<BodyCardProps> = (props) => {
  const { title, subTitle, extra, children, onSubmit, onRefresh } = props
  const history = useHistory()

  const goBack = () => {
    history.goBack()
  }

  const refresh = () => {
    onRefresh && onRefresh()
  }

  return (
    <div className={styles.wrapper}>
      <PageHeader
        className={styles.header}
        onBack={goBack}
        title={title}
        subTitle={subTitle}
        extra={[
          extra,
          <Button shape="round" icon={<SyncOutlined />} key="refresh" onClick={refresh}>刷新</Button>
        ]}
      />
      <div className={styles.main}>
        {children}
      </div>
      <div className={styles.footer}>
        <Button onClick={goBack}>
          取消
        </Button>
        <Button type="primary" style={{ margin: '0 10px' }} onClick={onSubmit}>
          保存
        </Button>
      </div>
    </div>
  )
}

export default BodyCard
