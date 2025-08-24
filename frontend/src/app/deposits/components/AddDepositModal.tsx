'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { depositService } from '@/services/depositService';
import Swal from 'sweetalert2';
import { memberService } from '@/services/memberService';

type AddDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddDepositModal: React.FC<AddDepositModalProps> = ({ isOpen, onClose }) => {
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const queryClient = useQueryClient();

  // fetch all members for dropdown
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getMembers,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberId || !amount) return;

    try {
      await depositService.addDeposit({
        member_id: memberId,
        amount,
      });
      Swal.fire({
        title: `${amount} Tk`,
        text: 'Deposit successfully',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setAmount('');
      setMemberId('');
      onClose();
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
      queryClient.invalidateQueries({ queryKey: ['deposit', memberId] });
    } catch (error) {
      Swal.fire({
        title: `Failed`,
        text: `Failed to deposit`,
        icon: 'error',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm md:max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Deposit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Member */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Member</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">Select Member</option>
              {members?.map((m: any) => (
                <option key={m.rid} value={m.rid}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepositModal;
