import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
//  Radio（单选框）、Typography（排版组件）、Spin（加载中动画）
import { Radio, Typography, Spin } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useLocation } from 'react-router';
import MainLayout from '../../components/Layout/MainLayout';
import TravelogueList from '../../components/Travelogue/TravelogueList';
import { getTravelogues } from '../../services/travelogueService';
import type { Travelogue, TravelogueStatusType } from '../../types';
import { TravelogueStatus } from '../../types';
//  useLocation（获取当前路由信息）
//  MainLayout（主布局组件）、TravelogueList（游记列表组件）
//  getTravelogues（获取游记列表的服务函数）
//  Travelogue（游记类型）、TravelogueStatusType（游记状态类型）
//  TravelogueStatus（游记状态枚举）
const { Title } = Typography;

const MainView: React.FC = () => {
  const [travelogues, setTravelogues] = useState<Travelogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    TravelogueStatusType | undefined
  >(undefined);
  const location = useLocation();

  // 根据路由路径设置过滤条件
  useEffect(() => {
    const path = location.pathname;

    if (path === '/pending') {
      setSelectedStatus(TravelogueStatus.PENDING);
    } else if (path === '/approved') {
      setSelectedStatus(TravelogueStatus.APPROVED);
    } else if (path === '/rejected') {
      setSelectedStatus(TravelogueStatus.REJECTED);
    } else {
      setSelectedStatus(undefined);
    }
  }, [location.pathname]);

  // 获取游记数据
  const fetchTravelogues = async () => {
    setLoading(true);
    try {
      const data = await getTravelogues(selectedStatus);
      setTravelogues(data);
      console.log('游记列表', data);
    } catch (error) {
      console.error('获取游记列表失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelogues();
  }, [selectedStatus]);

  // 筛选类型变更处理
  const handleStatusChange = (e: RadioChangeEvent) => {
    const value = e.target.value as TravelogueStatusType | 'all';
    setSelectedStatus(value === 'all' ? undefined : value);
  };

  // 根据当前选择的状态生成页面标题
  const getPageTitle = () => {
    switch (selectedStatus) {
      case TravelogueStatus.PENDING:
        return '待审核游记';
      case TravelogueStatus.APPROVED:
        return '已通过游记';
      case TravelogueStatus.REJECTED:
        return '未通过游记';
      default:
        return '全部游记';
    }
  };

  return (
    // 使用 Radio.Group 组件创建状态筛选按钮组
    // 可以筛选：全部、待审核、已通过、未通过
    // 当状态改变时触发 handleStatusChange 函数
    <MainLayout>
      <div className="mb-6">
        <Title level={3}>{getPageTitle()}</Title>
        <div className="my-4">
          <Radio.Group
            value={selectedStatus || 'all'}
            onChange={handleStatusChange}>
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value={TravelogueStatus.PENDING}>待审核</Radio.Button>
            <Radio.Button value={TravelogueStatus.APPROVED}>
              已通过
            </Radio.Button>
            <Radio.Button value={TravelogueStatus.REJECTED}>
              未通过
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        // 使用 TravelogueList 组件显示游记列表
        // 游记列表组件接收两个参数：
        // 1. travelogues：游记列表数据
        // 2. onStatusChange：状态改变时触发的事件处理函数
        <TravelogueList
          travelogues={travelogues}
          onStatusChange={fetchTravelogues}
        />
      )}
    </MainLayout>
  );
};

export default MainView;
