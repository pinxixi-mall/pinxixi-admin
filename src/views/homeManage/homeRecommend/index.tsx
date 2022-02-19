import React, { useState, useEffect } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, SpinProps, Tooltip, Image, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { SearchFormProps } from '@/components/SearchPannel'
import Table from '@/components/Table'
import { getRecommendList, updateRecommend, deleteRecommend } from '@/api'
const { useHistory } = require('react-router-dom')

export interface TableProps {
  key?: number;
  id?: number;
  desc: string;
  imageUrl: string;
  status?: string,
  sort?: number;
}

const HomeRecommend: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [searchParams, setSearchParams] = useState({})
  const [visible, setVisible] = useState<boolean>(false)
  const [pageType, setPageType] = useState<string>()
  const [detail, setDetail] = useState<TableProps>({
    desc: '',
    imageUrl: ''
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
      title: '产品ID',
      dataIndex: 'recommendId',
      width: 100,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: imageUrl => (
        <Image
          width={60}
          height={60}
          src={imageUrl}
        />
      ),
    },
    {
      title: '活动标题',
      dataIndex: 'description',
      key: 'description',
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
      dataIndex: 'price',
      key: 'price',
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
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'sort',
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
        const { status, recommendId } = record
        return (
          <Space size={0}>
            <Button type="link" onClick={() => handleRecommendEdit(recommendId)}>编辑</Button>
            <Button type="link" onClick={() => onChangeStatus(record)}>{status === 0 ? '上架' : '下架'}</Button>
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
      field: 'id'
    },
    {
      type: 'INPUT',
      label: '活动说明',
      field: 'desc',
    },
    {
      type: 'SELECT',
      label: '状态',
      field: 'status',
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
      key: it.recommendId
    }))
  }

  // 新增|编辑
  const handleRecommendEdit = (id?: string): void => {
    history.push(`/home-manage/recommend-edit?id=${id||''}`)
  }

  // 上、下架
  const onChangeStatus = (record: any) => {
    const { recommendId, status } = record
    Modal.confirm({
      title: `${status === 0 ? '上架' : '下架'}活动`,
      icon: <ExclamationCircleOutlined />,
      content: `确定${status === 0 ? '上架' : '下架'}该活动？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateRecommend({ recommendId, status: status === 0 ? 1 : 0 })
        message.success('操作成功')
        handleRefresh()
      }
    })
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
        await deleteRecommend({ recommendId })
        message.success('操作成功')
        handleRefresh()
      }
    })
  }

  const extra = (
    <>
      <Button type="primary" shape="round" icon={<PlusOutlined />} className="ml-10"
        onClick={() => handleRecommendEdit()}
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
          columns={columns}
          fetchApi={getRecommendList}
          searchParams={searchParams}
          refreshOutside={refresh}
          handleTableList={handleTableList}
        />
      </Card>
    </>
  )
}

export default HomeRecommend