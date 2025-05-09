// 用户角色常量
export const UserRole = {
  REVIEWER: 'reviewer', // 审核人员
  ADMIN: 'admin', // 管理员
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// 用户信息接口
export interface User {
  id: string;
  username: string;
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
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  status: TravelogueStatusType;
  rejectionReason?: string; // 拒绝原因，仅当状态为REJECTED时存在
  isDeleted: boolean; // 是否被逻辑删除
}
