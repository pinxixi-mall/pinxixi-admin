import React, { useState } from 'react'
import SearchPannel from '@/components/SearchPannel'
import { ColumnsType } from 'antd/es/table'
import { Card, Button, Space, Modal, message } from 'antd'
import { SyncOutlined, PlusOutlined, ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import type { SearchFormProps } from '@/components/SearchPannel'
import Table from '@/components/Table'
import { getGoodsCategorys, deleteGoodsCategory } from '@/api'
import Edit from "./edit"
import { getLabelByValue } from '@/utils/utils'
import { goodsCategoryLevelList } from '@/config/dataList'

export interface CategoryProps {
  key?: number | string;
  categoryId: number;
  categoryName: string;
  parentId?: number;
  categorySort?: number;
}

const GoodsCategory: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>()
  const [visible, setVisible] = useState<boolean>(false)
  const [queryParams, setSearchParams] = useState({})
  const [pageType, setPageType] = useState<string>()
  const [detail, setDetail] = useState<CategoryProps>({
    categoryId: 0,
    categoryName: '',
  })

  const columns: ColumnsType<CategoryProps> = [
    {
      title: '分类编号',
      key: 'categoryId',
      dataIndex: 'categoryId',
    },
    {
      title: '分类名称',
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: '分类级别',
      key: 'categoryLevel',
      dataIndex: 'categoryLevel',
      render: (text: any, record: any) => {
        return  getLabelByValue(record.categoryLevel, goodsCategoryLevelList)
      }
    },
    {
      title: '排序',
      key: 'categorySort',
      dataIndex: 'categorySort',
      width: 100,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 190
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      width: 190
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
  const searchFormList: Array<SearchFormProps> = [
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
    setSearchParams({
      ...values
    })
    handleRefresh()
  }

  // 处理表格返回数据：每项加key
  const handleTableList = (list: any[]): any[] => {
    let newList = list.slice(0)
    addKey(newList)

    function addKey(list: Array<any>): void {
      list.forEach((it: any, index: number) => {
        list[index] = {
          ...it,
          key: it.categoryId
        }
        if (it.children) {
          addKey(it.children)
        }
      })
    }

    return newList
  }

  // 新增|编辑
  const onEdit = (show: boolean, data?: CategoryProps): void => {
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
          columns={columns}
          fetchApi={getGoodsCategorys}
          queryParams={queryParams}
          refreshOutside={refresh}
          handleTableList={handleTableList}
          pagination={{ hide: true }}
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