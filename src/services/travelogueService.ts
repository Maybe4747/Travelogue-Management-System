import axios from './axios';
import type { Travelogue, TravelogueStatusType } from '../types';
import { BASE_URL } from '../const';

// 获取游记列表
export const getTravelogues = async (
  status?: TravelogueStatusType
): Promise<Travelogue[]> => {
  try {
    const params = status ? { status } : {};
    const response = await axios.get('/travelogues', { params });
    return response.data;
  } catch (error) {
    console.error('获取游记列表失败:', error);
    throw error;
  }
};

// 批准游记
export const approveTravelogue = async (id: string): Promise<Travelogue> => {
  try {
    const response = await axios.post('/travelogues', { id });
    return response.data;
  } catch (error) {
    console.error('批准游记失败:', error);
    throw error;
  }
};

// 拒绝游记
export const rejectTravelogue = async (
  id: string,
  rejectionReason: string
): Promise<Travelogue> => {
  try {
    const response = await axios.put('/travelogues', {
      id,
      rejection_reason: rejectionReason,
    });
    return response.data;
  } catch (error) {
    console.error('拒绝游记失败:', error);
    throw error;
  }
};

// 删除游记
export const deleteTravelogue = async (id: string): Promise<void> => {
  try {
    await axios.delete('/travelogues', { data: { id } });
  } catch (error) {
    console.error('删除游记失败:', error);
    throw error;
  }
};
