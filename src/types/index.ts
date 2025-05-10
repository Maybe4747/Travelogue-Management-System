// 用户角色常量
export const UserRole = {
  REVIEWER: 'reviewer', // 审核人员
  ADMIN: 'admin', // 管理员
  USER: 'user', // 用户
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// 用户信息接口
export interface User {
  id: string;
  nickname: string;
  password: string;
  role: UserRoleType;
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
}
