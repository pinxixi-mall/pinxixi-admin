import { useState, useEffect, ReactElement, FC } from 'react'
import { Table as AntTable, SpinProps, Radio } from 'antd'
import { PaginationProps, TableProps } from '@/types'

const Table: FC<TableProps> = (props: TableProps): ReactElement => {
  const { columns, fetchApi, queryParams = {}, refreshOutside, handleTableList, pagination: pagi = {} } = props
  const [refreshInside, setRefreshInside] = useState<boolean>()
  const [pagination, setPagination] = useState<PaginationProps>({
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
  const [tableData, setTableData] = useState<TableProps[]>([])

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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: TableProps[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: (record: DataType) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  return (
    <AntTable<TableProps>
      columns={columns}
      dataSource={tableData}
      loading={loading}
      rowSelection={{
        // type: "",
        ...rowSelection,
      }}
      pagination={{
        ...pagination,
        onChange: onPageChange
      }}
    />
  )
}

export default Table