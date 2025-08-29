'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { memberService } from '@/services/memberService';
import InputField from '@/components/common/InputField';
import InputSelect from '@/components/common/InputSelect';
import { mealService } from '@/services/mealService';

type AddMealModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose }) => {
  const [memberId, setMemberId] = useState('');
  const [mealCount, setMealCount] = useState('');
  const queryClient = useQueryClient();

  // fetch all members for dropdown
  const { data: meals } = useQuery({
    queryKey: ['meals'],
    queryFn: memberService.getMembers,
  });

  const memberOptions = [
    { value: '', label: 'Select Member' },
    ...(meals?.map((m: { rid: string; name: string }) => ({ value: m.rid, label: m.name })) ?? []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !mealCount) return;
    try {
      await mealService.addMeal({
        member_id: memberId,
        meal_count: mealCount,
      });
      Swal.fire({
        title: `${mealCount} Meals`,
        text: 'Meals added successfully',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setMealCount('');
      setMemberId('');
      onClose();
      queryClient.invalidateQueries({ queryKey: ['get-meals'] });
      queryClient.refetchQueries({ queryKey: ['get-meals'] });
    } catch (error) {
      Swal.fire({
        title: `Failed`,
        text: `Failed to add meal`,
        icon: 'error',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm md:max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          <span>Add Meals</span>
          <span className='font-medium'>{new Date().toISOString().split('T')[0]}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Member */}
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
            label="Meal Count"
            value={mealCount}
            onChange={(e) => setMealCount(e.target.value)}
            required={true}
            placeholder="Enter meal amount"
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

export default AddMealModal;
