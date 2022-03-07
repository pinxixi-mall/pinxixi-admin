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

  // 父组件修改页码后更新参数
  useEffect(() => {
    setPagination({
      ...pagination,
      current: searchParams.pageNum
    })
  }, [searchParams])

  // 请求表格列表数据
  useEffect(() => {
    const getList = async () => {
      const params = {
        ...searchParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      setLoading(true)
      try {
        let { data: { list, pageNum, pageSize, total } } = await fetchApi(params, { noLoading: true })
        const rows = handleTableList ? handleTableList(list) : list
        setTableData(rows)
        setPageData({ pageNum, pageSize, total })
      } catch (error) { console.log(error) }
      setLoading(false)
    }
    getList()
  }, [ fetchApi, refreshInside, refreshOutside])

  // 分页操作
  const onPageChange = (pageNum: number, pageSize?: number | undefined) => {
    setPagination({
      ...pagination,
      current: pageNum,
      pageSize
    })
    // 刷新表格
    handleRefresh()
  }

  // 分页数据更新
  const setPageData = ({ pageNum, pageSize, total }: { pageNum: number, pageSize: number, total: number }) => {
    setPagination({
      ...pagination,
      current: pageNum,
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