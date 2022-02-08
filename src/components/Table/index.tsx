import React, { useState, useEffect, ReactElement, FC } from 'react'
import { Table as AntTable, SpinProps } from 'antd'
import { PaginationProps, TableProps } from '@/types'

const Table: FC<TableProps> = (props: TableProps): ReactElement => {
  const { columns, fetchApi, searchParams = {}, refreshOutside, handleTableList, pagination: pagi = {} } = props
  const [refreshInside, setRefreshInside] = useState<boolean>()
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 5,
    total: 0,
    pageSizeOptions: ['5', '10', '20'],
    showQuickJumper: true,
    showSizeChanger: true,
    ...pagi
  })
  const [loading, setLoading] = useState<boolean | SpinProps | undefined>(false)
  const [tableData, setTableData] = useState<TableProps[]>([])

  // 内部刷新
  const handleRefresh = (): void => {
    setRefreshInside(!refreshInside)
  }

  // 请求表格列表数据
  useEffect(() => {
    const getList = async () => {
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams
      }
      setLoading(true)
      try {
        let { data: { list, pageData } } = await fetchApi(params, { noLoading: true })
        const rows = handleTableList ? handleTableList(list) : list
        setTableData(rows)
        setPageData(pageData)
      } catch (error) { console.log(error) }
      setLoading(false)
    }
    getList()
  }, [refreshInside, refreshOutside])

  // 分页操作
  const onPageChange = (pageNo: number, pageSize?: number | undefined) => {
    setPagination({
      ...pagination,
      current: pageNo,
      pageSize
    })
    // 刷新表格
    handleRefresh()
  }

  // 分页数据更新
  const setPageData = ({ pageNo, pageSize, total }: { pageNo: number, pageSize: number, total: number }) => {
    setPagination({
      ...pagination,
      current: pageNo,
      pageSize,
      total
    })
  }

  return (
    <AntTable<TableProps>
      columns={columns}
      dataSource={tableData}
      loading={loading}
      pagination={{
        ...pagination,
        onChange: onPageChange
      }}
    />
  )
}

export default Table