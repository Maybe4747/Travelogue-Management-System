import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Radio, Typography, Spin } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useLocation } from 'react-router';
import MainLayout from '../../components/Layout/MainLayout';
import TravelogueList from '../../components/Travelogue/TravelogueList';
import { getTraveloguesApi } from '../../services/api';
import type { Travelogue, TravelogueStatusType } from '../../types';
import { TravelogueStatus } from '../../types';

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
      const data = await getTraveloguesApi(selectedStatus);
      setTravelogues(data);
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
        <TravelogueList
          travelogues={travelogues}
          onStatusChange={fetchTravelogues}
        />
      )}
    </MainLayout>
  );
};

export default MainView;
