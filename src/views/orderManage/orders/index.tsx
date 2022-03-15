import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Space, SpinProps, Modal, message } from 'antd'
import { SyncOutlined, ExclamationCircleOutlined, RetweetOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { getOrders, updateOrder } from '@/api'
import { PaginationType } from '@/types'
import { getLabelByValue } from '@/utils/utils'
import { orderStatuslList, paymentStatuslList, paymentTypelList } from '@/config/dataList'
export interface OrderType {
  key?: number;
  orderId?: number;
  orderImage: string;
  orderStatus?: string,
  orderSort?: number;
}

const Orders: React.FC = (props: any) => {
  const [loading, setLoading] = useState<boolean | SpinProps | undefined>(false)
  const [tableData, setTableData] = useState<OrderType[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [pageType, setPageType] = useState<string>()
  const [refresh, setRefresh] = useState<boolean>()
  const [detail, setDetail] = useState<OrderType>({
    orderImage: ''
  })
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 5,
    total: 0,
    pageSizeOptions: ['5', '10', '20'],
    showQuickJumper: true,
    showSizeChanger: true
  })
  const [queryParams, setQueryParams] = useState({})

  useEffect(() => {
    const getList = async () => {
      const params = {
        ...queryParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }
      setLoading(true)
      try {
        let { data: { list, pageNum, pageSize, total } } = await getOrders(params)
        const rows = list.map((it: any) => ({
          ...it,
          key: it.orderId
        }))
        setTableData(rows)
        setPagination({
          ...pagination,
          current: pageNum,
          pageSize,
          total
        })
      } catch (error) { console.log(error);
      }
      setLoading(false)
    }
    getList()
  }, [refresh])

  // 新增|编辑
  const onEditVisible = (show: boolean, data?: OrderType): void => {
    setVisible(show)
    setPageType(data ? 'EDIT' : 'ADD')
    if (data) {
      setDetail(data)
    } else {
      setDetail({
        orderImage: '',
      })
    }
  }

  // 刷新
  const handleRefresh = (isReset: boolean): void => {   
    isReset && setPagination({
      ...pagination,
      current: 1,
    })
    setVisible(false)
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
      title: '订单总价',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      width: 120
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

  return (
    <>
      <Card
        title="订单列表"
        extra={extra}
      >
        <Table<OrderType>
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={{
            ...pagination,
            onChange: onPageChange,
          }}
        />
      </Card>
    </>
  );
}

export default Orders