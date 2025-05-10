import '@ant-design/v5-patch-for-react-19';
import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Input,
  message,
  Image,
  Card,
  Typography,
} from 'antd';
import { TravelogueStatus } from '../../types';
import type { Travelogue, TravelogueStatusType, Comment } from '../../types';
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CommentOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  approveTravelogue,
  rejectTravelogue,
  deleteTravelogue,
} from '../../services/travelogueService';

const { TextArea } = Input;
const { Text } = Typography;

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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string>('');

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleApprove = async (id: string) => {
    setLoading(true);
    try {
      await approveTravelogue(id);
      message.success('游记已通过审核');
      onStatusChange();
    } catch (error) {
      console.error('操作失败', error);
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
      await rejectTravelogue(selectedTravelogueId, rejectionReason);
      message.success('已拒绝该游记');
      setRejectModalVisible(false);
      onStatusChange();
    } catch (error) {
      console.error('操作失败', error);
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
          await deleteTravelogue(id);
          message.success('游记已删除');
          onStatusChange();
        } catch (error) {
          console.error('删除失败', error);
          message.error('删除失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showImagePreview = (images: string[]) => {
    setPreviewImages(images);
    setPreviewVisible(true);
  };

  const showVideoPreview = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setVideoModalVisible(true);
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

  const renderComments = (comments: Comment[]) => {
    if (!comments || comments.length === 0) {
      return <Text type="secondary">暂无评论</Text>;
    }

    return (
      <div className="space-y-2">
        {comments.map((comment) => (
          <Card key={comment.id} size="small" className="mb-2">
            <div className="flex justify-between">
              <Text strong>用户 {comment['user_id']}</Text>
              <Text type="secondary">
                {new Date(comment.created_at).toLocaleString('zh-CN')}
              </Text>
            </div>
            <Text>{comment.content}</Text>
          </Card>
        ))}
      </div>
    );
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
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
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
        columns={columns}
        dataSource={travelogues}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4">
              <div className="mb-4">
                <Text strong>内容：</Text>
                <Text className="whitespace-pre-line">{record.content}</Text>
              </div>

              {record.image && record.image.length > 0 && (
                <div className="mb-4">
                  <Text strong>图片：</Text>
                  <div className="flex gap-2 mt-2">
                    {record.image.slice(0, 3).map((image, index) => (
                      <Image
                        key={index}
                        width={100}
                        height={100}
                        src={image}
                        alt={`图片 ${index + 1}`}
                        className="object-cover"
                      />
                    ))}
                    {record.image.length > 3 && (
                      <Button
                        type="link"
                        icon={<CommentOutlined />}
                        onClick={() => showImagePreview(record.image)}>
                        查看全部 ({record.image.length})
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {record.video && (
                <div className="mb-4">
                  <Text strong>视频：</Text>
                  <div className="mt-2">
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => showVideoPreview(record.video!)}>
                      播放视频
                    </Button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <Text strong>评论：</Text>
                {renderComments(record.comments)}
              </div>

              {record.status === TravelogueStatus.REJECTED &&
                record.rejection_reason && (
                  <div className="mt-4">
                    <Tag color="red">拒绝原因</Tag>
                    <p className="mt-1">{record.rejection_reason}</p>
                  </div>
                )}
            </div>
          ),
        }}
      />

      <Modal
        title="拒绝原因"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        confirmLoading={loading}>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="请输入拒绝原因"
        />
      </Modal>

      <Modal
        title="图片预览"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}>
        <div className="grid grid-cols-3 gap-4">
          {previewImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`图片 ${index + 1}`}
              className="w-full h-48 object-cover"
            />
          ))}
        </div>
      </Modal>

      <Modal
        title="视频播放"
        open={videoModalVisible}
        footer={null}
        onCancel={() => setVideoModalVisible(false)}
        width={800}>
        <div className="aspect-video">
          <video
            controls
            className="w-full h-full"
            src={currentVideo}
            controlsList="nodownload">
            您的浏览器不支持视频播放
          </video>
        </div>
      </Modal>
    </>
  );
};

export default TravelogueList;
