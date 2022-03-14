import { useState, useEffect, ReactElement, FC } from 'react'
import { Table as AntTable, SpinProps, Radio } from 'antd'
import { PaginationType, TableType } from '@/types'

const Table: FC<TableType> = (props: TableType): ReactElement => {
  const { columns, fetchApi, queryParams = {}, refreshOutside, handleTableList, pagination: pagi = {}, rowSelection } = props
  const [refreshInside, setRefreshInside] = useState<boolean>()
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: pagi.hide ? 0 : 5,
    total: 0,
    pageSizeOptions: ['5', '10', '20'],
    showQuickJumper: true,
    showSizeChanger: true,
    position: ['none', pagi.hide ? 'none' : 'bottomRight'],
    ...pagi
  })
  const [loading, setLoading] = useState<boolean | SpinProps | undefined>(false)
  const [tableData, setTableData] = useState<TableType[]>([])

  // 内部刷新
  const handleRefresh = (): void => {
    setRefreshInside(!refreshInside)
  }

  // 父组件修改页码后更新参数
  useEffect(() => {
    setPagination({
      ...pagination,
      current: queryParams.pageNum
    })
  }, [queryParams])

  // 请求表格列表数据
  useEffect(() => {
    const getList = async () => {
      const pagiParam = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      let params = { ...queryParams }
      if (!pagi.hide) {
        Object.assign(params, pagiParam)
      }
      
      setLoading(true)
      try {
        let rows = []
        let { data } = await fetchApi(params, { noLoading: true })
        if (!pagi.hide) {
          // 有分页
          const { list, pageNum, pageSize, total } = data
          rows = handleTableList ? handleTableList(list) : list
          setPageData({ pageNum, pageSize, total })
        } else {
          // 无分页
          rows = handleTableList ? handleTableList(data) : data
        }
        setTableData(rows)
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
    <AntTable<TableType>
      columns={columns}
      dataSource={tableData}
      loading={loading}
      rowSelection={rowSelection}
      pagination={{
        ...pagination,
        onChange: onPageChange
      }}
    />
  )
}

export default Table