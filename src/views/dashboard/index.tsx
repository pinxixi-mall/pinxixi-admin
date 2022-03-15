import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Statistic } from 'antd'
import { ArrowUpOutlined, ShoppingCartOutlined, PayCircleOutlined, UsergroupAddOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

type ECOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

const Dashboard: React.FC = () => {
  const salesRef = useRef<any>(null)
  const salesChartRef = useRef<any>(null)
  const [salesChartWidth, setSalesChartWidth] = useState<number>()
  const [salesChart, setsalesChart] = useState<any>()

  useEffect(() => {
    console.log(salesRef);
    console.log(salesRef.current.offsetWidth);

    setSalesChartWidth(salesRef.current.offsetWidth)
    salesChart.resize()
  }, [])

  useEffect(() => {
    // setSalesChartWidth(salesRef.current.offsetWidth)
    const salesChart1 = echarts.init(salesChartRef.current)
    setsalesChart(salesChart1)
    const option: ECOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    }
    salesChart.setOption(option)
    
  }, [])




  return (
    <div>
      <Row className={styles.tag} gutter={20}>
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
      <Row className={styles.overview} gutter={20}>
        <Col span={14}>
          <div className={styles.card}>
            <header>销售概览</header>
            <section ref={salesRef}>
              <div ref={salesChartRef} className={styles.salesChart} style={{ width: salesChartWidth + 'px' }}></div>
            </section>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default inject('LayoutStore')(observer(Dashboard))