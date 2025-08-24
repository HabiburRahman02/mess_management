import axiosInstance from '@/api/axiosInstance';

export type Member = {
  rid: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export const memberService = {
  getMembers: async () => {
    const { data } = await axiosInstance.get('/members');
    if (data.statusText === 'SUCCESS') return data.data;
    throw new Error('Failed to fetch members');
  },

  addMember: async (newMember: { name: string; email: string; phone: string }) => {
    const result = await axiosInstance.post('/members', newMember);
    return result?.data;
  },

  deleteMember: async (rid: string) => {
    const result = await axiosInstance.delete(`/members/${rid}`);
    return result?.data;
  },  
};
