import React, { useEffect, useState } from 'react'
import { Card, Button, Space, SpinProps, Modal, message } from 'antd'
import { SyncOutlined, ExclamationCircleOutlined, RetweetOutlined, DeleteOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { getOrders, updateOrder } from '@/api'
import { PaginationType, OrderType } from '@/types'
import { getLabelByValue } from '@/utils/utils'
import { orderStatuslList, paymentStatuslList, paymentTypelList } from '@/config/dataList'
import Table from '@/components/Table'

const Orders: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 5,
    total: 0,
    pageSizeOptions: ['5', '10', '20'],
    showQuickJumper: true,
    showSizeChanger: true
  })
  const [queryParams, setQueryParams] = useState({})

  // 刷新
  const handleRefresh = (isReset: boolean): void => {   
    isReset && setPagination({
      ...pagination,
      current: 1,
    })
    setRefresh(!refresh)
  }

  // 上、下架
  const toDetail = (record: any) => {
    const { orderId, orderStatus } = record
    Modal.confirm({
      title: `${orderStatus === '0' ? '上架' : '下架'}活动`,
      icon: <ExclamationCircleOutlined />,
      content: `确定${orderStatus === '0' ? '上架' : '下架'}该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateOrder({ orderId, orderStatus: orderStatus === '0' ? '1' : '0' })
        message.success('操作成功')
        setRefresh(!refresh)
      }
    })
  }

  // 删除
  const onOrderClose = (record: any) => {
    const { orderId } = record
    Modal.confirm({
      title: '关闭订单',
      icon: <ExclamationCircleOutlined />,
      content: `确定关闭该订单？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateOrder({ orderId, isDeleted: 1 })
        message.success('操作成功')
        setRefresh(!refresh)
      }
    })
  }

  // 分页
  const onPageChange = (page: number, pageSize?: number | undefined) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize
    })
    setRefresh(!refresh)
  }

  const extra = (
    <>
      <Button shape="round" icon={<SyncOutlined />} className="ml-10"
        onClick={() => handleRefresh(true)}
      >
        刷新
      </Button>
    </>
  )

  const columns: ColumnsType<OrderType> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 120,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (text: any, record: any) => {
        return getLabelByValue(record.orderStatus, orderStatuslList)
      }
    },
    {
      title: '订单总价',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      width: 120
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      render: (text: any, record: any) => {
        return getLabelByValue(record.paymentStatus, paymentStatuslList)
      }
    },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 120,
      render: (text: any, record: any) => {
        return getLabelByValue(record.paymentType, paymentTypelList)
      }
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      width: 160,
      render: (text: any, record: any) => {
        return record.updateTime
      }
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
      title: '操作',
      key: 'action',
      width: 200,
      render: (text: any, record: any) => {
        const { orderStatus } = record
        return (
          <Space size={0}>
            <Button type="link" icon={<RetweetOutlined />} onClick={() => toDetail(record)}>订单详情</Button>
            <Button type="link" icon={<DeleteOutlined />} danger onClick={() => onOrderClose(record)}>关闭订单</Button>
          </Space>
        )
      },
    },
  ]

  // 处理表格返回数据
  const handleTableList = (list: any[]): any[] => {
    return list.map((it: any) => ({
      ...it,
      key: it.goodsId
    }))
  }

  return (
    <>
      <Card
        title="订单列表"
        extra={extra}
      >
        <Table
          columns={columns}
          fetchApi={getOrders}
          queryParams={queryParams}
          refreshOutside={refresh}
          handleTableList={handleTableList}
        />
      </Card>
    </>
  );
}

export default Orders