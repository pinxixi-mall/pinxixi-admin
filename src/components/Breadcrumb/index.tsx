import React from 'react'
import { Breadcrumb as BreadcrumbAnt } from 'antd'

type breadsProps = {
  breads: Array<string>
}

const Breadcrumb = (props: breadsProps) => {
  return (
    <BreadcrumbAnt style={{ margin: '16px 20px' }}>
      {
        props.breads.map(bread => <BreadcrumbAnt.Item key={bread}>{bread}</BreadcrumbAnt.Item>)
      }
    </BreadcrumbAnt>
  )
}

export default Breadcrumb