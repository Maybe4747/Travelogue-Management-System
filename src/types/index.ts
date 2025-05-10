// 用户角色常量
export const UserRole = {
  REVIEWER: 'reviewer', // 审核人员
  ADMIN: 'admin', // 管理员
  USER: 'user', // 用户
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// 用户信息接口
export interface UserInfo {
  avatar: string;
  nickname: string;
  gender: string;
  birthday: string;
  city: string;
  signature: string;
  follow: string[];
  fans: string[];
  notes: string[];
}

export interface User {
  id: string;
  name: string;
  user_info: UserInfo;
  role: UserRoleType;
  created_at: string;
  updated_at: string;
}

// 评论接口
export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 游记状态常量
export const TravelogueStatus = {
  PENDING: 'pending', // 待审核
  APPROVED: 'approved', // 已通过
  REJECTED: 'rejected', // 未通过
} as const;

export type TravelogueStatusType =
  (typeof TravelogueStatus)[keyof typeof TravelogueStatus];

// 游记信息接口
export interface Travelogue {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: TravelogueStatusType;
  rejection_reason?: string; // 拒绝原因，仅当状态为REJECTED时存在
  is_deleted: boolean; // 是否被逻辑删除
  image: string[]; // 图片数组
  video?: string; // 视频URL
  comments: Comment[]; // 评论数组
}
