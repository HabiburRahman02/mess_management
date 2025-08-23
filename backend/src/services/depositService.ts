import depositRepository from '../repositories/depositRepository';

class DepositService {
  getDeposits = async () => {
    const result = await depositRepository.getDeposits();
    return result;
  };

  getDepositByMemberId = async (memberId: string) => {
    return await depositRepository.getDepositByMemberId(memberId);
  };

  addDeposit = async (deposit: { member_id: string; amount: number }) => {
    return await depositRepository.addDeposit(deposit);
  };

  updateDepositByRid = async (rid: string, amount: string) => {
    return await depositRepository.updateDepositByRid(rid, amount);
  };
}

export default new DepositService();
