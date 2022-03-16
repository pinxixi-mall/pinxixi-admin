import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Space, SpinProps, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, RetweetOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import CarouselEdit from './components/Edit'
import { getHomeCarousel, updateHomeCarousel } from '@/api'
import { PaginationType } from '@/types'
export interface CarouselType {
  key?: number;
  carouselId?: number;
  carouselImage: string;
  carouselStatus?: string,
  carouselSort?: number;
}

const HomeCarousel: React.FC = () => {
  const [loading, setLoading] = useState<boolean | SpinProps | undefined>(false)
  const [tableData, setTableData] = useState<CarouselType[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [pageType, setPageType] = useState<string>()
  const [refresh, setRefresh] = useState<boolean>()
  const [detail, setDetail] = useState<CarouselType>({
    carouselImage: ''
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
        let { data: { list, pageNum, pageSize, total } } = await getHomeCarousel(params, { noLoading: true })
        const rows = list.map((it: any) => ({
          ...it,
          key: it.carouselId
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
  const onEditVisible = (show: boolean, data?: CarouselType): void => {
    setVisible(show)
    setPageType(data ? 'EDIT' : 'ADD')
    if (data) {
      setDetail(data)
    } else {
      setDetail({
        carouselImage: '',
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
  const onChangeStatus = (record: any) => {
    const { carouselId, carouselStatus } = record
    Modal.confirm({
      title: `${carouselStatus === '0' ? '上架' : '下架'}活动`,
      icon: <ExclamationCircleOutlined />,
      content: `确定${carouselStatus === '0' ? '上架' : '下架'}该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateHomeCarousel({ carouselId, carouselStatus: carouselStatus === '0' ? '1' : '0' })
        message.success('操作成功')
        setRefresh(!refresh)
      }
    })
  }

  // 删除
  const onDelete = (record: any) => {
    const { carouselId } = record
    Modal.confirm({
      title: '删除活动',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateHomeCarousel({ carouselId, isDeleted: 1 })
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
      <Button type="primary" shape="round" icon={<PlusOutlined />} className="ml-10"
        onClick={() => onEditVisible(true)}
      >
        新增
      </Button>
      <Button shape="round" icon={<SyncOutlined />} className="ml-10"
        onClick={() => handleRefresh(true)}
      >
        刷新
      </Button>
    </>
  )

  const columns: ColumnsType<CarouselType> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text: string, record, index) => <a>{index + 1}</a>,
    },
    {
      title: '轮播图',
      dataIndex: 'carouselImage',
      key: 'carouselImage',
      width: 200,
      render: carouselImage => (
        <Image
          width={100}
          height={50}
          src={carouselImage}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'carouselSort',
      key: 'carouselSort',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'carouselStatus',
      key: 'carouselStatus',
      width: 120,
      render: (text: any, record: any) => {
        return record.carouselStatus === '0' ? '已下架' : '上架中'
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
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
      render: (text: any, record: any) => {
        return record.updateTime
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text: any, record: any) => {
        const { carouselStatus } = record
        return (
          <Space size={0}>
            <Button type="link" icon={<FormOutlined />} onClick={() => onEditVisible(true, record)}>编辑</Button>
            <Button type="link" icon={<RetweetOutlined />} onClick={() => onChangeStatus(record)}>{carouselStatus === '0' ? '上架' : '下架'}</Button>
            <Button type="link" icon={<DeleteOutlined />} danger onClick={() => onDelete(record)}>删除</Button>
          </Space>
        )
      },
    },
  ]

  return (
    <>
      <Card
        title="首页轮播列表"
        extra={extra}
      >
        <Table<CarouselType>
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={{
            ...pagination,
            onChange: onPageChange,
          }}
        />
      </Card>
      <CarouselEdit
        visible={visible}
        pageType={pageType}
        detail={detail}
        onCancel={() => onEditVisible(false)}
        onSuccess={() => handleRefresh(false)}
      />
    </>
  );
}

export default HomeCarousel