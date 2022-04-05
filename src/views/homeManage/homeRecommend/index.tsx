import React, { useState } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, FormOutlined, DeleteOutlined  } from '@ant-design/icons'
import type { SearchItemType } from '@/types'
import Table from '@/components/Table'
import { getRecommends, deleteRecommend } from '@/api'
import Edit from "./edit"

export interface RecommendProps {
  key?: number | string;
  recommendId: number;
  goodsId: number;
  goodsImage?: string,
  recommendSort?: number;
}

const HomeRecommend: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [visible, setVisible] = useState<boolean>(false)
  const [queryParams, setQueryParams] = useState({})
  const [pageType, setPageType] = useState<string>()
  const [detail, setDetail] = useState<RecommendProps>({
    recommendId: 0,
    goodsId: 0,
  })

  const columns: ColumnsType<RecommendProps> = [
    {
      title: '推荐描述',
      dataIndex: 'recommendDesc',
    },
    {
      title: '商品编号',
      dataIndex: 'goodsId',
      width: 100,
    },
    {
      title: '商品图片',
      dataIndex: 'goodsImage',
      width: 120,
      render: goodsImage => (
        <Image
        width={60}
        height={60}
        src={goodsImage}
        />
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'goodsPrice',
      width: 120,
      render: value => `￥${value.toFixed(2)}`
    },
    {
      title: '排序',
      dataIndex: 'recommendSort',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 190,
      render: (text: any, record: any) => {
        return record.createTime
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (text: any, record: any) => {
        return (
          <Space size={0}>
            <Button type="link" icon={<FormOutlined />} onClick={() => onEdit(true, record)}>编辑</Button>
            <Button type="link" icon={<DeleteOutlined />} danger onClick={() => onDelete(record)}>删除</Button>
          </Space>
        )
      },
    },
  ]

  // 搜索面板
  const searchFormList: Array<SearchItemType> = [
    {
      type: 'INPUT',
      label: '商品编号',
      field: 'goodsId',
      placeholder: '商品编号(精确)'
    },
    {
      type: 'INPUT',
      label: '推荐描述',
      field: 'recommendDesc',
      placeholder: '推荐描述(模糊)'
    },
  ]

  // 刷新
  const handleRefresh = (): void => {
    setVisible(false)
    setRefresh(!refresh)
  }

  // 搜索
  const onSearch = (values: any): void => {
    setQueryParams({
      ...values,
      pageNum: 1
    })
    handleRefresh()
  }

  // 新增|编辑
  const onEdit = (show: boolean, data?: RecommendProps): void => {
    setVisible(show)
    setPageType(data ? 'EDIT' : 'ADD')
    data && setDetail(data)
  }

  // 删除
  const onDelete = (record: any) => {
    const { recommendId } = record
    Modal.confirm({
      title: '删除活动',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteRecommend(recommendId)
        message.success('操作成功')
        handleRefresh()
      }
    })
  }

  const extra = (
    <>
      <Button type="primary" shape="round" icon={<PlusOutlined />} className="ml-10"
        onClick={() => onEdit(true)}
      >
        新增
      </Button>
      <Button shape="round" icon={<SyncOutlined />} className="ml-10"
        onClick={handleRefresh}
      >
        刷新
      </Button>
    </>
  )

  return (
    <>
      <SearchPannel searchFormList={searchFormList} onSearch={onSearch} />
      <Card
        title="首页推荐列表"
        extra={extra}
      >
        <Table
          rowKey="recommendId"
          columns={columns}
          fetchApi={getRecommends}
          queryParams={queryParams}
          refreshOutside={refresh}
        />
      </Card>
      <Edit
        visible={visible}
        pageType={pageType}
        detail={detail}
        onCancel={() => onEdit(false)}
        onSuccess={ handleRefresh }
      />
    </>
  )
}

export default HomeRecommend