'use client';

import axiosInstance from '@/api/axiosInstance';
import { depositService } from '@/services/depositService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import InputField from '@/components/common/InputField';

type MealModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedMemberMealId: string | null;
};

const UpdateMealModal: React.FC<MealModalProps> = ({ isOpen, onClose, selectedMemberMealId }) => {
  const queryClient = useQueryClient();
  const [mealCount, setMealCount] = useState<Record<string, string>>({});

  const {
    data: meal,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['meal', selectedMemberMealId],
    queryFn: () => depositService.getDepositByMemberId(selectedMemberMealId as string),
    enabled: !!isOpen && !!selectedMemberMealId, // Only run query when modal is open and id is present
  });

  const handleInputChange = (depositId: string, value: string) => {
    setEditedAmounts((prev) => ({
      ...prev,
      [depositId]: value,
    }));
  };

  //   const handleUpdate = async (depositId: string) => {
  //     const newAmount = editedAmounts[depositId];
  //     if (!newAmount) return;

  //     try {
  //       const result = await axiosInstance.patch(`/deposits/${depositId}`, {
  //         amount: newAmount,
  //       });

  //       refetch();
  //       queryClient.invalidateQueries({ queryKey: ['deposits'] });
  //       queryClient.invalidateQueries({ queryKey: ['deposit', selectedMemberMealId] });

  //       if (result?.data?.statusText === 'SUCCESS') {
  //         Swal.fire({
  //           title: `${newAmount} Tk`,
  //           text: `${result?.data?.message}`,
  //           icon: 'success',
  //         });
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         title: `Failed`,
  //         text: 'Update failed ❌',
  //         icon: 'error',
  //       });
  //       console.error(error);
  //     }
  //   };

  if (!isOpen || !selectedMemberMealId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex justify-between items-center border-b border-sky-600 pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Meal Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {isError && <p className="text-center text-red-500">Failed to fetch meals.</p>}

        {meal && (
          <div className="space-y-4">
            {/* Member Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {meal.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {meal.email}
              </p>
              <p>
                <span className="font-semibold">Total Meal:</span> {meal.total_deposit}
              </p>
            </div>

            {/* Deposit List */}
            <div>
              <h4 className="mt-2 mb-2 font-medium text-gray-700">Meal History</h4>
              <div className="max-h-60 overflow-y-auto border border-sky-600 rounded-lg p-3">
                <ul className="divide-y divide-gray-200">
                  {/* Header Row */}
                  <li className="flex items-center justify-between py-2 text-sm font-semibold text-gray-900 bg-gray-100 rounded">
                    <span className="w-1/3">Created At</span>
                    <span className="w-1/3">Count</span>
                    <span className="w-1/3 text-center">Action</span>
                  </li>

                  {/* Deposit Rows */}
                  {meal.deposit_details?.map((d: any) => (
                    <li
                      key={d.rid}
                      className="flex items-center justify-between gap-5 py-2 text-sm text-gray-700"
                    >
                      {/* Created Date */}
                      <span className="w-1/3">{d.created_date}</span>

                      {/* Amount Input */}
                      <input
                        type="number"
                        defaultValue={d.amount}
                        className="w-1/3 border px-2 py-1 rounded"
                        onChange={(e) => handleInputChange(d.rid, e.target.value)}
                      />
                      {/* Update Button */}
                      <button
                        // onClick={() => handleUpdate(d.rid)}
                        className="w-1/3 rounded bg-sky-600 px-3 py-1 text-white hover:bg-sky-700 transition"
                      >
                        Update
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMealModal;
