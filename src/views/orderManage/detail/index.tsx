import { FC, useEffect, useState } from "react";
import BodyCard from "@/components/BodyCard";
import { getOrderDetail } from "@/api";
import { GoodsType, OrderDetail } from "@/types";
import { Descriptions, Image, Table, Tooltip } from 'antd';
import { ColumnsType } from "antd/lib/table";
import { orderStatuslList, paymentStatuslList, paymentTypelList } from "@/config/dataList";
import { getLabelByValue } from "@/utils/utils";

export default (props: any) => {
    const [detail, setDetail] = useState<OrderDetail>()

    useEffect(() => {
        const getDetail = async () => {
            const { data } = await getOrderDetail(props.match.params.orderId)
            setDetail(data)
        }
        getDetail()
    }, [])

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
            render: desc => (
                <Tooltip placement="top" title={desc}>
                    {desc}
                </Tooltip>
            ),
        },
        {
            title: '商品图片',
            dataIndex: 'goodsImage',
            width: 100,
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
            title: '单价',
            dataIndex: 'goodsPrice',
            width: 120,
            render: value => `￥${value.toFixed(2)}`
        },
        {
            title: '数量',
            dataIndex: 'goodsCount',
            width: 100,
            render: value => `x${value}`
        },
        {
            title: '小计',
            dataIndex: 'goodsCount',
            width: 130,
            render: (text, record: any) => '￥' + (record.goodsPrice * record.goodsCount).toFixed(2)
        },
    ]

    const handleRefresh = () => {

    };
    return <BodyCard title="订单详情" showFooter={false} onRefresh={handleRefresh}>
        <Descriptions title="基本信息" bordered>
            <Descriptions.Item label="订单编号">{detail?.orderNo}</Descriptions.Item>
            <Descriptions.Item label="下单时间">{detail?.createTime}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
                {detail && getLabelByValue(detail.orderStatus, orderStatuslList)}    
            </Descriptions.Item>
            <Descriptions.Item label="订单总额">￥{detail?.orderPrice.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="优惠金额">￥{detail?.orderCoupon}</Descriptions.Item>
            <Descriptions.Item label="支付状态" span={2}>
                {detail && getLabelByValue(detail.paymentStatus, paymentStatuslList)}
            </Descriptions.Item>
            <Descriptions.Item label="支付方式" span={1}>
                {detail && getLabelByValue(detail.paymentType, paymentTypelList) || '-'}    
            </Descriptions.Item>
            <Descriptions.Item label="支付时间" span={1}>{detail?.paymentTime || '-'}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="收货信息" style={{ marginTop: '20px' }} bordered>
            <Descriptions.Item label="姓名" span={1}>{detail?.address.name}</Descriptions.Item>
            <Descriptions.Item label="联系电话" span={2}>{detail?.address.tel}</Descriptions.Item>
            <Descriptions.Item label="收货地址" span={3}>
                {detail?.address.province + detail?.address.city + detail?.address.county + detail?.address.addressDetail }
            </Descriptions.Item>
        </Descriptions>
        <Descriptions title="商品信息" style={{ marginTop: '20px' }}>
            <Descriptions.Item span={3}>
                <Table<GoodsType>
                    rowKey="orderId"
                    size="small"
                    bordered
                    columns={columns}
                    dataSource={detail?.goodsList}
                    pagination={{
                        position: []
                    }}
                />
            </Descriptions.Item>
        </Descriptions>
    </BodyCard>
};
