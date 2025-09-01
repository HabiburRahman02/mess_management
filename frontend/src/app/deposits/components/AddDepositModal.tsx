'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { depositService } from '@/services/depositService';
import Swal from 'sweetalert2';
import { memberService } from '@/services/memberService';
import InputField from '@/components/common/InputField';
import InputSelect from '@/components/common/InputSelect';

type AddDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddDepositModal: React.FC<AddDepositModalProps> = ({ isOpen, onClose }) => {
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [depositDate, setDepositDate] = useState(() => {
  const today = new Date();
  // YYYY-MM-DD format
  return today.toISOString().split('T')[0];
});

  const queryClient = useQueryClient();

  // fetch all members for dropdown
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getMembers,
  });

  const memberOptions = [
    { value: '', label: 'Select Member' },
    ...(members?.map((m: { rid: string; name: string }) => ({ value: m.rid, label: m.name })) ??
      []),
  ];

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm md:max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Deposit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Member */}
          <InputSelect
            label="Select Member"
            onChange={(e) => setMemberId(e.target.value)}
            value={memberId}
            required={true}
            options={memberOptions}
          ></InputSelect>
          {/* Amount */}
          <InputField
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required={true}
            placeholder="Enter deposit amount"
          ></InputField>
          <InputField
            type="date"
            label="Deposit Date"
            value={depositDate}
            onChange={(e) => setDepositDate(e.target.value)}
            required={true}
          ></InputField>

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
              className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
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
