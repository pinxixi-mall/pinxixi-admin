import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Space, SpinProps, Tooltip, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import SearchPannel from '@/components/SearchPannel'
import CarouselEdit from './components/Edit'
import { getHomeCarousel, updateCarouselStatus, deleteCarousel } from '@/api'
import type { SearchFormProps } from '@/components/SearchPannel'
export interface CarouselProps {
  key?: number;
  carouselId?: number;
  carouselImage: string;
  carouselStatus?: string,
  carouselSort?: number;
}

export interface paginationProps {
  current: number;
  pageSize: number | undefined;
  total: number;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
}

const HomeCarousel: React.FC = (props: any) => {
  const [loading, setLoading] = useState<boolean | SpinProps | undefined>(false)
  const [tableData, setTableData] = useState<CarouselProps[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [pageType, setPageType] = useState<string>()
  const [refresh, setRefresh] = useState<boolean>()
  const [detail, setDetail] = useState<CarouselProps>({
    carouselImage: ''
  })
  const [pagination, setPagination] = useState<paginationProps>({
    current: 1,
    pageSize: 2,
    total: 0,
    pageSizeOptions: ['5', '10', '20'],
    showQuickJumper: true,
    showSizeChanger: true
  })
  const [searchParams, setSearchParams] = useState({})

  useEffect(() => {
    const getList = async () => {
      const params = {
        ...searchParams,
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
  const onEditVisible = (show: boolean, data?: CarouselProps): void => {
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
  const handleRefresh = (): void => {
    setVisible(false)
    setRefresh(!refresh)
  }

  // 搜索
  const onSearch = (values: any) => {
    console.log(values);
    setPagination({
      ...pagination,
      current: 1
    })
    setSearchParams(values)
    setRefresh(!refresh)
  }

  // 上、下架
  const onChangeStatus = (record: any) => {
    const { CarouselId, carouselStatus } = record
    Modal.confirm({
      title: `${carouselStatus === '0' ? '上架' : '下架'}活动`,
      icon: <ExclamationCircleOutlined />,
      content: `确定${carouselStatus === '0' ? '上架' : '下架'}该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateCarouselStatus({ CarouselId, carouselStatus: carouselStatus === '0' ? '1' : '0' })
        message.success('操作成功')
        setRefresh(!refresh)
      }
    })
  }

  // 删除
  const onDelete = (record: any) => {
    const { CarouselId } = record
    Modal.confirm({
      title: '删除活动',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteCarousel({ CarouselId })
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
        onClick={handleRefresh}
      >
        刷新
      </Button>
    </>
  )

  const columns: ColumnsType<CarouselProps> = [
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
            <Button type="link" onClick={() => onEditVisible(true, record)}>编辑</Button>
            <Button type="link" onClick={() => onChangeStatus(record)}>{carouselStatus === '0' ? '上架' : '下架'}</Button>
            <Button type="link" danger onClick={() => onDelete(record)}>删除</Button>
          </Space>
        )
      },
    },
  ]

  const searchFormList: Array<SearchFormProps> = [
    {
      type: 'INPUT',
      label: '活动ID',
      field: 'CarouselId'
    },
    {
      type: 'INPUT',
      label: '活动说明',
      field: 'desc',
    },
    {
      type: 'SELECT',
      label: '状态',
      field: 'carouselStatus',
      initialValue: '',
      options: [
        { value: '', label: '全部'},
        { value: '1', label: '上架中'},
        { value: '0', label: '已下架'}
      ]
    }
  ]

  return (
    <>
      {/* <SearchPannel searchFormList={searchFormList} onSearch={onSearch} /> */}
      <Card
        title="首页轮播列表"
        extra={extra}
      >
        <Table<CarouselProps>
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
        onSuccess={handleRefresh}
      />
    </>
  );
}

export default HomeCarousel