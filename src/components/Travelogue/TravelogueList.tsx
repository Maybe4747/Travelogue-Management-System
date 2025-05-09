import '@ant-design/v5-patch-for-react-19';
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Input, message } from 'antd';
import { TravelogueStatus } from '../../types';
import type { Travelogue, TravelogueStatusType } from '../../types';
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import {
  approveTravelogueApi,
  rejectTravelogueApi,
  deleteTravelogueApi,
} from '../../services/api';
import { UserRole } from '../../types';

const { TextArea } = Input;

interface TravelogueListProps {
  travelogues: Travelogue[];
  onStatusChange: () => void;
}

const TravelogueList: React.FC<TravelogueListProps> = ({
  travelogues,
  onStatusChange,
}) => {
  const { user } = useAuth();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedTravelogueId, setSelectedTravelogueId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleApprove = async (id: string) => {
    setLoading(true);
    try {
      const success = await approveTravelogueApi(id);
      if (success) {
        message.success('游记已通过审核');
        onStatusChange();
      } else {
        message.error('操作失败，请稍后重试');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const showRejectModal = (id: string) => {
    setSelectedTravelogueId(id);
    setRejectionReason('');
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!selectedTravelogueId) return;

    if (!rejectionReason.trim()) {
      message.error('请填写拒绝原因');
      return;
    }

    setLoading(true);
    try {
      const success = await rejectTravelogueApi(
        selectedTravelogueId,
        rejectionReason
      );
      if (success) {
        message.success('已拒绝该游记');
        setRejectModalVisible(false);
        onStatusChange();
      } else {
        message.error('操作失败，请稍后重试');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条游记吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          const success = await deleteTravelogueApi(id);
          if (success) {
            message.success('游记已删除');
            onStatusChange();
          } else {
            message.error('删除失败，请稍后重试');
          }
        } catch (error) {
          message.error('删除失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getStatusTag = (status: TravelogueStatusType) => {
    switch (status) {
      case TravelogueStatus.PENDING:
        return <Tag color="blue">待审核</Tag>;
      case TravelogueStatus.APPROVED:
        return <Tag color="green">已通过</Tag>;
      case TravelogueStatus.REJECTED:
        return <Tag color="red">未通过</Tag>;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: TravelogueStatusType) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Travelogue) => (
        <Space size="small">
          {record.status === TravelogueStatus.PENDING && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                loading={loading}>
                通过
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => showRejectModal(record.id)}
                loading={loading}>
                拒绝
              </Button>
            </>
          )}
          {isAdmin && (
            <Button
              danger
              type="primary"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              loading={loading}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        dataSource={travelogues}
        columns={columns}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4">
              <p className="whitespace-pre-line">{record.content}</p>
              {record.status === TravelogueStatus.REJECTED &&
                record.rejectionReason && (
                  <div className="mt-4">
                    <Tag color="red">拒绝原因</Tag>
                    <p className="mt-1">{record.rejectionReason}</p>
                  </div>
                )}
            </div>
          ),
        }}
      />

      <Modal
        title="拒绝游记"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="提交"
        cancelText="取消"
        confirmLoading={loading}>
        <div className="mb-2">请填写拒绝原因：</div>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="请详细说明拒绝原因，以便用户理解并改进"
        />
      </Modal>
    </>
  );
};

export default TravelogueList;
