import {useTranslate, IResourceComponentsProps, HttpError, CrudFilters, GetListResponse} from "@pankod/refine-core";

import {
  List,
  Row, Col, Select, Card, Drawer, Descriptions, Typography, Skeleton, Icons, Statistic, Progress
} from "@pankod/refine-antd";

import React, {useState} from "react";
import "moment/locale/ru";

const DashboardPage: React.FC<IResourceComponentsProps<GetListResponse<{}>>> = () => {

  return (
    <Row gutter={[16, 16]} style={{height: '50vh'}}>
      <Col xs={24} sm={24} md={12} lg={16} className={"flex-column"}>
        <Card style={{marginBottom: '16px'}}>
          <Typography.Title level={3} style={{color: '#626262'}}>Тут скоро будет дашбоард</Typography.Title>
        </Card>
        <Card className={"settings-products-card"}>
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col span={12}>
              <Statistic
                title={<Skeleton  paragraph={{ rows: 1 }} active={false}/>}
                value={'--'}
                precision={2}
                valueStyle={{ color: '#bebebe4d' }}
                prefix={<Icons.ArrowUpOutlined  style={{ marginBottom: 0 }}/>}
                suffix="%"
              />
            </Col>
            <Col span={12}>

              <Statistic
                title={<Skeleton paragraph={{ rows: 1 }} active={false}/>}
                value={'--'}
                precision={2}
                valueStyle={{ color: '#bebebe4d' }}
                prefix={<Icons.ArrowDownOutlined style={{ marginBottom: 0 }} />}
                suffix="%"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic title={<Skeleton paragraph={{ rows: 1 }} active={false}/>} value={'--'}
                         valueStyle={{ color: '#bebebe4d' }} prefix={<Icons.LikeOutlined style={{ marginBottom: 0 }} />} />
            </Col>
            <Col span={12}>
              <Statistic title={<Skeleton paragraph={{ rows: 1 }} active={false}/>} value={'--'}
                         valueStyle={{ color: '#bebebe4d' }} suffix="/ 100" />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={12} lg={8} className={"flex-column"}>
        <Card className={"settings-products-card"}>
          <Skeleton active={false} />
          <Skeleton active={false} />
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Progress
                type="circle"
                style={{width: '100%', color: 'rgba(190,190,190,0.59)'}}
                strokeColor={{
                  '0%': 'rgba(190,190,190,0.19)',
                  '100%': 'rgba(190,190,190,0.59)',
                }}
                success={{
                  strokeColor: 'rgba(190,190,190,0.59)'
                }}
                percent={100}
              />
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Progress
                type="circle"
                style={{width: '100%', color: 'rgba(190,190,190,0.59)'}}
                strokeColor={{
                  '0%': 'rgba(190,190,190,0.19)',
                  '100%': 'rgba(190,190,190,0.59)',
                }}
                success={{
                  strokeColor: 'rgba(190,190,190,0.59)'
                }}
                percent={0}
              />
            </Col>
          </Row>

        </Card>
      </Col>
    </Row>
  );
};


export default DashboardPage;