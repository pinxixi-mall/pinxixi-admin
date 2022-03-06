import React, { useState, useEffect } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, SpinProps, Tooltip, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { SearchFormProps } from '@/components/SearchPannel'
import Table from '@/components/Table'
import { getGoods, updateRecommend, deleteRecommend } from '@/api'
const { useHistory } = require('react-router-dom')

export interface TableProps {
  key?: number;
  goodsId?: number;
  goodsDesc: string;
  goodsImage: string;
  goodsStatus?: string,
}

const Goods: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [searchParams, setSearchParams] = useState({})
  const [visible, setVisible] = useState<boolean>(false)
  const [pageType, setPageType] = useState<string>()
  const [detail, setDetail] = useState<TableProps>({
    goodsDesc: '',
    goodsImage: ''
  })
  const history = useHistory()

  const columns: ColumnsType<TableProps> = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text: string, record, index) => <a>{index + 1}</a>,
    // },
    {
      title: '商品编号',
      dataIndex: 'goodsId',
      width: 160,
    },
    {
      title: '商品图片',
      dataIndex: 'goodsImage',
      key: 'goodsImage',
      width: 140,
      render: goodsImage => (
        <Image
          width={60}
          height={60}
          src={goodsImage}
        />
      ),
    },
    {
      title: '商品描述',
      dataIndex: 'goodsDesc',
      key: 'goodsDesc',
      ellipsis: {
        showTitle: false,
      },
      render: desc => (
        <Tooltip placement="top" title={desc}>
          {desc}
        </Tooltip>
      ),
    },
    {
      title: '价格',
      dataIndex: 'goodsPrice',
      key: 'goodsPrice',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text: any, record: any) => {
        return record.createTime
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
      render: (text: any, record: any) => {
        return record.updateTime
      }
    },
    {
      title: '状态',
      dataIndex: 'goodsStatus',
      key: 'goodsStatus',
      width: 120,
      render: (text: any, record: any) => {
        return record.status === 0 ? '已下架' : '上架中'
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text: any, record: any) => {
        const { goodsStatus, goodsId } = record
        return (
          <Space size={0}>
            <Button type="link" onClick={() => handleGoodsEdit(goodsId)}>编辑</Button>
            <Button type="link" onClick={() => onChangeStatus(record)}>{goodsStatus === 0 ? '上架' : '下架'}</Button>
            <Button type="link" danger onClick={() => onDelete(record)}>删除</Button>
          </Space>
        )
      },
    },
  ]

  const searchFormList: Array<SearchFormProps> = [
    {
      type: 'INPUT',
      label: '商品编号',
      field: 'goodsId'
    },
    {
      type: 'INPUT',
      label: '商品描述',
      field: 'goodsDesc',
    },
    {
      type: 'SELECT',
      label: '状态',
      field: 'goodsStatus',
      initialValue: '',
      options: [
        { value: '', label: '全部' },
        { value: 1, label: '上架中' },
        { value: 0, label: '已下架' }
      ]
    }
  ]

  // 刷新
  const handleRefresh = (): void => {
    setRefresh(!refresh)
  }

  // 搜索
  const onSearch = (values: any): void => {
    setSearchParams(values)
    handleRefresh()
  }

  // 处理表格返回数据
  const handleTableList = (list: any[]): any[] => {
    return list.map((it: any) => ({
      ...it,
      key: it.goodsId
    }))
  }

  // 新增|编辑
  const handleGoodsEdit = (id?: number): void => {
    history.push(`/goods-manage/goods-edit?id=${id||''}`)
  }

  // 上、下架
  const onChangeStatus = (record: any) => {
    const { goodsId, goodsStatus } = record
    Modal.confirm({
      title: `${goodsStatus === 0 ? '上架' : '下架'}商品`,
      icon: <ExclamationCircleOutlined />,
      content: `确定${goodsStatus === 0 ? '上架' : '下架'}该商品？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateRecommend({ goodsId, goodsStatus: goodsStatus === 0 ? 1 : 0 })
        message.success('操作成功')
        handleRefresh()
      }
    })
  }

  // 删除
  const onDelete = (record: any) => {
    const { goodsId } = record
    Modal.confirm({
      title: '删除商品',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除该商品？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteRecommend({ goodsId })
        message.success('操作成功')
        handleRefresh()
      }
    })
  }

  const extra = (
    <>
      <Button type="primary" shape="round" icon={<PlusOutlined />} className="ml-10"
        onClick={() => handleGoodsEdit()}
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
        title="商品列表"
        extra={extra}
      >
        <Table
          columns={columns}
          fetchApi={getGoods}
          searchParams={searchParams}
          refreshOutside={refresh}
          handleTableList={handleTableList}
        />
      </Card>
    </>
  )
}

export default Goods