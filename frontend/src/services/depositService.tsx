import axiosInstance from '@/api/axiosInstance';

export const depositService = {
  getDeposits: async () => {
    const res = await axiosInstance.get('/deposits');
    return res?.data?.data;
  },
  getDepositByMemberId: async (rid: string) => {
    const res = await axiosInstance.get(`deposits/${rid}`);
    return res?.data?.data;
  },
  addDeposit: async ({ member_id, amount }: { member_id: string; amount: string }) => {
    const res = await axiosInstance.post('/deposits', { member_id, amount });
    return res?.data?.data;
  },
};
