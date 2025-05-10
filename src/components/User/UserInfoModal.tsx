import React, { useEffect, useState } from 'react';
import { Modal, Card, Avatar, Typography, Spin, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getUserInfo } from '../../services/userService';
import type { User } from '../../types';

const { Title, Text } = Typography;

interface UserInfoModalProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  userId,
  visible,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserInfo = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const userData = await getUserInfo(userId);
      setUser(userData);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && userId) {
      fetchUserInfo();
    }
  }, [visible, userId]);

  return (
    <Modal
      title="用户信息"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : user ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar
              size={64}
              src={user.user_info?.avatar}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={4}>
                {user.user_info?.nickname || '未设置昵称'}
              </Title>
              <Text type="secondary">ID: {user.id}</Text>
            </div>
          </div>

          <Card title="基本信息" size="small">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text type="secondary">用户名：</Text>
                <Text>{user.name}</Text>
              </div>
              <div>
                <Text type="secondary">性别：</Text>
                <Text>{user.user_info?.gender || '未设置'}</Text>
              </div>
              <div>
                <Text type="secondary">生日：</Text>
                <Text>{user.user_info?.birthday || '未设置'}</Text>
              </div>
              <div>
                <Text type="secondary">城市：</Text>
                <Text>{user.user_info?.city || '未设置'}</Text>
              </div>
              <div className="col-span-2">
                <Text type="secondary">个性签名：</Text>
                <Text>{user.user_info?.signature || '未设置'}</Text>
              </div>
            </div>
          </Card>

          <Card title="社交信息" size="small">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text type="secondary">关注：</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.user_info?.follow?.map((id) => (
                    <Tag key={id} color="blue">
                      用户 {id}
                    </Tag>
                  )) || <Text type="secondary">暂无关注</Text>}
                </div>
              </div>
              <div>
                <Text type="secondary">粉丝：</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.user_info?.fans?.map((id) => (
                    <Tag key={id} color="green">
                      用户 {id}
                    </Tag>
                  )) || <Text type="secondary">暂无粉丝</Text>}
                </div>
              </div>
              <div className="col-span-2">
                <Text type="secondary">游记：</Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.user_info?.notes?.map((id) => (
                    <Tag key={id} color="purple">
                      游记 {id}
                    </Tag>
                  )) || <Text type="secondary">暂无游记</Text>}
                </div>
              </div>
            </div>
          </Card>

          <Card title="账户信息" size="small">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text type="secondary">角色：</Text>
                <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
                  {user.role === 'admin' ? '管理员' : '普通用户'}
                </Tag>
              </div>
              <div>
                <Text type="secondary">注册时间：</Text>
                <Text>{new Date(user.created_at).toLocaleString('zh-CN')}</Text>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center text-gray-500">未找到用户信息</div>
      )}
    </Modal>
  );
};

export default UserInfoModal;
