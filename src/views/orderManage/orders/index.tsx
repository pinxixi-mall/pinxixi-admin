import React, { useState } from 'react'
import { Card, Button, Space, Modal, message } from 'antd'
import { SyncOutlined, ExclamationCircleOutlined, FileTextOutlined, CloseOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { getOrders, updateOrder } from '@/api'
import { PaginationType, OrderType } from '@/types'
import { getLabelByValue } from '@/utils/utils'
import { orderStatuslList, paymentStatuslList, paymentTypelList } from '@/config/dataList'
import Table from '@/components/Table'
const { useHistory } = require('react-router-dom')

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
  const [queryParams] = useState({})
  const history = useHistory()

  // 刷新
  const handleRefresh = (isReset: boolean): void => {   
    isReset && setPagination({
      ...pagination,
      current: 1,
    })
    setRefresh(!refresh)
  }

  // 详情
  const toDetail = (record: any) => {
    const { orderId } = record
    history.push(`/order-manage/order-detail/${orderId}`)
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
        await updateOrder({ orderId, orderStatus: 5 })
        message.success('操作成功')
        setRefresh(!refresh)
      }
    })
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
      width: 120,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 100,
      render: (text: any, record: any) => {
        return getLabelByValue(record.orderStatus, orderStatuslList)
      }
    },
    {
      title: '订单总价',
      dataIndex: 'orderPrice',
      width: 140,
      render: value => `￥${value.toFixed(2)}`
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 100,
      render: (text: any, record: any) => {
        return getLabelByValue(record.paymentStatus, paymentStatuslList)
      }
    },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      width: 100,
      render: (text: any, record: any) => {
        return getLabelByValue(record.paymentType, paymentTypelList) || '-'
      }
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      render: (text: any, record: any) => {
        return record.paymentTime || '-'
      }
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      render: (text: any, record: any) => {
        return record.createTime
      }
    },
    {
      title: '操作',
      width: 100,
      render: (text: any, record: any) => {
        const { orderStatus } = record
        return (
          <Space size={0}>
            <Button type="link" icon={<FileTextOutlined />} onClick={() => toDetail(record)}>详情</Button>
            {
              orderStatus === 0 && <Button type="link" icon={<CloseOutlined />} danger onClick={() => onOrderClose(record)}>关闭</Button>
            }
          </Space>
        )
      },
    },
  ]

  return (
    <>
      <Card
        title="订单列表"
        extra={extra}
      >
        <Table
          rowKey='orderId'
          columns={columns}
          fetchApi={getOrders}
          queryParams={queryParams}
          refreshOutside={refresh}
        />
      </Card>
    </>
  );
}

export default Orders