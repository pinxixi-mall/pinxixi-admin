import React, { useState } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, Modal, message, Image } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import type { SearchItemType } from '@/types'
import Table from '@/components/Table'
import { getGoodsCategorys, deleteGoodsCategory } from '@/api'
import Edit from "./edit"
import { getLabelByValue } from '@/utils/utils'
import { goodsCategoryLevelList } from '@/config/dataList'

export interface CategoryType {
  key?: number | string;
  categoryId: number;
  categoryName: string;
  parentId?: number;
  categorySort?: number;
  categoryLevel?: number;
  categoryImage?: string;
  children: CategoryType[] | null;
}

const GoodsCategory: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [visible, setVisible] = useState<boolean>(false)
  const [queryParams, setQueryParams] = useState({})
  const [pageType, setPageType] = useState<string>()
  const [detail, setDetail] = useState<Partial<CategoryType>>({})

  const columns: ColumnsType<CategoryType> = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
    },
    {
      title: '分类编号',
      dataIndex: 'categoryId',
    },
    {
      title: '图标',
      dataIndex: 'categoryImage',
      render: icon => (
        <Image
          width={50}
          height={50}
          src={icon}
        />
      ),
    },
    {
      title: '分类级别',
      dataIndex: 'categoryLevel',
      render: (text: any, record: any) => {
        return  getLabelByValue(record.categoryLevel, goodsCategoryLevelList)
      }
    },
    {
      title: '排序',
      dataIndex: 'categorySort',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
      label: '分类编号',
      field: 'categoryId'
    },
    {
      type: 'INPUT',
      label: '分类名称',
      field: 'categoryName',
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
      ...values
    })
    handleRefresh()
  }

  // 新增|编辑
  const onEdit = (show: boolean, data?: CategoryType): void => {
    setVisible(show)
    setPageType(data ? 'EDIT' : 'ADD')
    data && setDetail(data)
  }

  // 删除
  const onDelete = (record: any) => {
    const { categoryId } = record
    Modal.confirm({
      title: '删除分类',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除该分类？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteGoodsCategory(categoryId)
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
        title="商品分类"
        extra={extra}
      >
        <Table
          rowKey='categoryId'
          columns={columns}
          fetchApi={getGoodsCategorys}
          queryParams={queryParams}
          refreshOutside={refresh}
          pagination={{ hidePagination: true, noPagination: true }}
        />
      </Card>
      <Edit
        visible={visible}
        pageType={pageType}
        detail={detail}
        onCancel={() => onEdit(false)}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default GoodsCategory