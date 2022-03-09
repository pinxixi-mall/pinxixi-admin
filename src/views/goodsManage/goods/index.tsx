import React, { useState, useEffect, useCallback } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, Tooltip, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { SearchFormProps } from '@/components/SearchPannel'
import Table from '@/components/Table'
import { getGoods, updateGoodsStatus, deleteGoods } from '@/api'
import { goodsStatusList } from "@/config/dataList"
import { getLabelByValue } from '@/utils/utils'
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
  const history = useHistory()

  const columns: ColumnsType<TableProps> = [
    {
      title: '商品编号',
      dataIndex: 'goodsId',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '商品图片',
      dataIndex: 'goodsImage',
      key: 'goodsImage',
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
      title: '状态',
      dataIndex: 'goodsStatus',
      key: 'goodsStatus',
      width: 100,
      render: (text: any, record: any) => {
        return getLabelByValue(record.goodsStatus, goodsStatusList)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
      render: (text: any, record: any) => {
        return record.createTime
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 170,
      render: (text: any, record: any) => {
        return record.updateTime
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
    setSearchParams({
      ...values,
      pageNum: 1
    })
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
        const {msg} = await deleteGoods({ goodsId })
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