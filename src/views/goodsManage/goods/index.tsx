import React, { useState } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, Tooltip, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, ColumnHeightOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import type { SearchItemType, GoodsType } from '@/types'
import Table from '@/components/Table'
import { getGoods, updateGoodsStatus, deleteGoods } from '@/api'
import { goodsStatusList } from "@/config/dataList"
import { getLabelByValue } from '@/utils/utils'
const { useHistory } = require('react-router-dom')

const Goods: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [queryParams, setQueryParams] = useState({})
  const history = useHistory()

  const columns: ColumnsType<GoodsType> = [
    {
      title: '商品编号',
      dataIndex: 'goodsId',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
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
      title: '商品图片',
      dataIndex: 'goodsImage',
      width: 100,
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
      render: value => `￥${value.toFixed(2)}`
    },
    {
      title: '商品库存',
      dataIndex: 'goodsStock',
    },
    {
      title: '状态',
      dataIndex: 'goodsStatus',
      width: 100,
      render: (text: any, record: any) => {
        return getLabelByValue(record.goodsStatus, goodsStatusList)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (text: any, record: any) => {
        return record.createTime
      }
    },
    {
      title: '操作',
      width: 260,
      render: (text: any, record: any) => {
        const { goodsStatus, goodsId } = record
        return (
          <Space size={0}>
            <Button type="link" icon={<FormOutlined />} onClick={() => handleGoodsEdit(goodsId)}>编辑</Button>
            <Button type="link" icon={<ColumnHeightOutlined />} onClick={() => onChangeStatus(record)}>{goodsStatus === 0 ? '上架' : '下架'}</Button>
            <Button type="link" icon={<DeleteOutlined />} danger onClick={() => onDelete(record)}>删除</Button>
          </Space>
        )
      },
    },
  ]

  const searchFormList: Array<SearchItemType> = [
    {
      type: 'INPUT',
      label: '商品编号',
      field: 'goodsId'
    },
    {
      type: 'INPUT',
      label: '商品名称',
      field: 'goodsName',
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
        ...goodsStatusList
      ]
    }
  ]

  // 刷新
  const handleRefresh = (): void => {
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
        await updateGoodsStatus({ goodsId, goodsStatus: goodsStatus === 0 ? 1 : 0 })
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
        const {msg} = await deleteGoods(goodsId)
        message.success(msg)
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
          rowKey='goodsId'
          columns={columns}
          fetchApi={getGoods}
          queryParams={queryParams}
          refreshOutside={refresh}
        />
      </Card>
    </>
  )
}

export default Goods