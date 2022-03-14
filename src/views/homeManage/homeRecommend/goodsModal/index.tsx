import React, { useEffect, useState } from 'react'
import { Tooltip, Image, Modal, Radio } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { getGoods } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import { GoodsType } from '@/views/goodsManage/goods'
import { getLabelByValue } from '@/utils/utils'
import { goodsStatusList } from '@/config/dataList'
import Table from '@/components/Table'
import { useRequest } from '@/hooks'

interface ModalFormProps {
    visible: boolean;
    goodsId: number;
    onCancel(): void;
    onSuccess(goods: GoodsType): void;
}

const GoodsModal: React.FC<ModalFormProps> = ({ visible, onCancel, goodsId, onSuccess }) => {
    const [confirmLoading, setConfirmLoading] = useState<boolean>()
    const [refresh, setRefresh] = useState<boolean>()
    const [queryParams, setQueryParams] = useState({})
    const [selectedGoods, setSelectedGoods] = useState<GoodsType>()

    const columns: ColumnsType<GoodsType> = [
        {
            title: '商品编号',
            dataIndex: 'goodsId',
            width: 100
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: '商品图片',
            dataIndex: 'goodsImage',
            key: 'goodsImage',
            width: 120,
            render: goodsImage => (
                <Image
                    width={60}
                    height={60}
                    src={goodsImage}
                />
            ),
        },
        {
            title: '商品描述',
            dataIndex: 'goodsDesc',
            key: 'goodsDesc',
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
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            width: 120
        },
        {
            title: '状态',
            dataIndex: 'goodsStatus',
            key: 'goodsStatus',
            width: 100,
            render: (text: any, record: any) => {
                return getLabelByValue(record.goodsStatus, goodsStatusList)
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 190,
            render: (text: any, record: any) => {
                return record.createTime
            }
        },
    ]

    // 处理表格返回数据
    const handleTableList = (list: any[]): any[] => {
        return list.map((it: any) => ({
            ...it,
            key: it.goodsId
        }))
    }

    // 提交
    const handleOk = () => {
        selectedGoods && onSuccess(selectedGoods)
        onCancel()
    }

    const rowSelection = {
        type: "radio",
        onChange: (selectedRowKeys: React.Key[], selectedRows: GoodsType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedGoods(selectedRows[0])
        }, 
    }

    return (
        <Modal
            title="选择商品"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={() => onCancel()}
            maskClosable={false}
            width={1000}
        >
            <Table
                columns={columns}
                fetchApi={getGoods}
                queryParams={queryParams}
                refreshOutside={refresh}
                handleTableList={handleTableList}
                rowSelection={rowSelection}
            />
        </Modal>
    );
}

export default GoodsModal