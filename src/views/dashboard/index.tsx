import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Statistic } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ArrowUpOutlined, ShoppingCartOutlined, PayCircleOutlined, UsergroupAddOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { OrderType } from '@/types'
import Table from '@/components/Table'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
import { BarChart, BarSeriesOption, PieChart, PieSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout } from 'echarts/features'
import { getLabelByValue } from '@/utils/utils'
import { orderStatuslList, paymentStatuslList, paymentTypelList } from '@/config/dataList'
import { getOrders } from '@/api'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  PieChart,
  LabelLayout
])

type ECOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | PieSeriesOption
>

const Dashboard: React.FC = () => {
  const salesRef = useRef<any>(null)
  const salesChartRef = useRef<any>(null)
  const distributedRef = useRef<any>(null)
  const distributedChartRef = useRef<any>(null)

  const [refresh] = useState<boolean>()
  const [queryParams] = useState({})

  // 销售概况
  useEffect(() => {
    setTimeout(() => {
      const salesChart = echarts.init(salesChartRef.current, {}, {
        width: salesRef.current.clientWidth
      })
      const itemStyle = {
        normal: {
          barBorderRadius: 6
        }
      }
      const barWidth: number = 24
      const option: ECOption | any = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['访问量', '成交量']
        },
        xAxis: [
          {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          left: 50,
          right: 30,
          bottom: 30
        },
        series: [
          {
            name: '访问量',
            type: 'bar',
            barWidth,
            data: [
              20, 49, 70, 232, 256, 767, 135
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            itemStyle: {
              normal: {
                ...itemStyle.normal,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ])
              }
            }
          },
          {
            name: '成交量',
            type: 'bar',
            barWidth,
            data: [
              26, 59, 90, 264, 287, 470, 176
            ],
            markPoint: {
              data: [
                { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
                { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
              ]
            },
            itemStyle: {
              normal: {
                ...itemStyle.normal,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#f89aa8' },
                  { offset: 0.5, color: '#ee5770' },
                  { offset: 1, color: '#ec2546' }
                ])
              }
            }
          }
        ]
      };

      salesChart?.setOption(option)
    })
  }, [])

  // 销售分布
  useEffect(() => {
    setTimeout(() => {
      const rankChart = echarts.init(distributedChartRef.current, {}, {
        width: distributedRef.current.clientWidth
      })
      const option: ECOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: 'bottom'
        },
        series: [
          {
            name: '销售分布',
            type: 'pie',
            radius: [40, 110],
            center: ['50%', '43%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 6
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 40, name: '手机数码' },
              { value: 38, name: '家用电器' },
              { value: 32, name: '电脑办公' },
              { value: 30, name: '玩具乐器' },
              { value: 28, name: '家居厨具' },
              { value: 18, name: '钟表珠宝' }
            ]
          }
        ]
      };

      rankChart?.setOption(option)
    })
  }, [])

  const columns: ColumnsType<OrderType> = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 120,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      width: 160,
      render: (text: any, record: any) => {
        return record.createTime
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 120,
      render: (text: any, record: any) => {
        return getLabelByValue(record.orderStatus, orderStatuslList)
      }
    },
    {
      title: '订单总价',
      dataIndex: 'orderPrice',
      width: 120,
      render: value => `￥${value.toFixed(2)}`
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 120,
      render: (text: any, record: any) => {
        return getLabelByValue(record.paymentStatus, paymentStatuslList)
      }
    },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      width: 120,
      render: (text: any, record: any) => {
        return getLabelByValue(record.paymentType, paymentTypelList) || '-'
      }
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      width: 160,
      render: (text: any, record: any) => {
        return record.paymentTime || '-'
      }
    },
  ]

  return (
    <div>
      <Row className={styles.row} gutter={20} style={{marginTop: '20px'}}>
        <Col span={6}>
          <div className={`${styles.tagItem} ${styles.order}`}>
            <Statistic
              title="今日订单"
              value={2757}
              valueStyle={{ color: '#1488ee' }}
            />
            <div className={styles.tagIcon}>
              <ShoppingCartOutlined />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={`${styles.tagItem} ${styles.income}`}>
            <Statistic
              title="今日收入"
              value={9699}
              precision={2}
              valueStyle={{ color: '#e9445d' }}
              prefix="￥"
            />
            <div className={styles.tagIcon}>
              <PayCircleOutlined />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={`${styles.tagItem} ${styles.guest}`}>
            <Statistic
              title="今日访客"
              value={29}
              valueStyle={{ color: '#ff7a4e' }}
              prefix={<PlusOutlined />}
            />
            <div className={styles.tagIcon}>
              <UsergroupAddOutlined />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={`${styles.tagItem} ${styles.transfer}`}>
            <Statistic
              title="转化率"
              value={78.6}
              precision={2}
              valueStyle={{ color: '#61b977' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <div className={styles.tagIcon}>
              <LineChartOutlined />
            </div>
          </div>
        </Col>
      </Row>
      <Row className={styles.row} gutter={20}>
        <Col span={14}>
          <div className={styles.card}>
            <header>销售概况</header>
            <section ref={salesRef}>
              <div ref={salesChartRef} className={styles.chart}></div>
            </section>
          </div>
        </Col>
        <Col span={10}>
          <div className={styles.card}>
            <header>销售分布</header>
            <section ref={distributedRef}>
              <div ref={distributedChartRef} className={styles.chart}></div>
            </section>
          </div>
        </Col>
      </Row>
      <Row className={styles.row} gutter={20}>
        <Col span={24}>
          <div className={styles.card}>
            <header>最新订单</header>
            <Table
              rowKey='orderId'
              columns={columns}
              fetchApi={getOrders}
              queryParams={queryParams}
              refreshOutside={refresh}
              pagination={{noPagination: true}}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default inject('LayoutStore')(observer(Dashboard))