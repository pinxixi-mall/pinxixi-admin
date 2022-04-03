import { Breadcrumb as BreadcrumbAnt } from 'antd'

type BreadsProps = {
  breads: Array<string>
}

const Breadcrumb = (props: BreadsProps) => {

  return (
    <BreadcrumbAnt style={{ padding: '10px 24px' }}>
      {
        props.breads.map(bread => <BreadcrumbAnt.Item key={bread}>{bread}</BreadcrumbAnt.Item>)
      }
    </BreadcrumbAnt>
  )
}

export default Breadcrumb