import type { User, Travelogue, TravelogueStatusType } from '../types';
import users from '../../mock/users.json';
import travelogues from '../../mock/travelogues.json';

// 模拟数据存储
const mockUsers = [...users] as User[];
const mockTravelogues = [...travelogues] as Travelogue[];

// 用户相关API
export const loginApi = (
  username: string,
  password: string
): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.nickname === username && u.password === password
      );
      resolve(user || null);
    }, 300);
  });
};

// // 游记相关API
// export const getTraveloguesApi = (
//   status?: TravelogueStatusType
// ): Promise<Travelogue[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       let filteredTravelogues = mockTravelogues.filter(
//         (travelogue) => !travelogue.isDeleted
//       );

//       if (status) {
//         filteredTravelogues = filteredTravelogues.filter(
//           (travelogue) => travelogue.status === status
//         );
//       }

//       resolve(filteredTravelogues);
//     }, 300);
//   });
// };

// export const approveTravelogueApi = (id: string): Promise<boolean> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const index = mockTravelogues.findIndex((t) => t.id === id);
//       if (index !== -1) {
//         mockTravelogues[index].status = TravelogueStatus.APPROVED;
//         mockTravelogues[index].updatedAt = new Date().toISOString();
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     }, 300);
//   });
// };

// export const rejectTravelogueApi = (
//   id: string,
//   reason: string
// ): Promise<boolean> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const index = mockTravelogues.findIndex((t) => t.id === id);
//       if (index !== -1) {
//         mockTravelogues[index].status = TravelogueStatus.REJECTED;
//         mockTravelogues[index].rejectionReason = reason;
//         mockTravelogues[index].updatedAt = new Date().toISOString();
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     }, 300);
//   });
// };

// export const deleteTravelogueApi = (id: string): Promise<boolean> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const index = mockTravelogues.findIndex((t) => t.id === id);
//       if (index !== -1) {
//         mockTravelogues[index].isDeleted = true;
//         mockTravelogues[index].updatedAt = new Date().toISOString();
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     }, 300);
//   });
// };
