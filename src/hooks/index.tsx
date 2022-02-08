import React, { useState, useEffect } from 'react'
import { PaginationProps } from '@/types'

const useTable = (options?: PaginationProps, updateTable?: () => void) => {
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 5,
    total: 0,
    pageSizeOptions: ['5', '10', '20'],
    showQuickJumper: true,
    showSizeChanger: true,
    ...options
  })

  // 分页操作
  const onPageChange = (pageNo: number, pageSize?: number | undefined) => {
    setPagination({
      ...pagination,
      current: pageNo,
      pageSize
    })
    // 刷新表格
    updateTable && updateTable()
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

  return [pagination, setPageData, onPageChange]
}

export {
  useTable
}
