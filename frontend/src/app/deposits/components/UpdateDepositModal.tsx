'use client';

import axiosInstance from '@/api/axiosInstance';
import { depositService } from '@/services/depositService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedRid: string | null;
};

const UpdateDepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, selectedRid }) => {
  const queryClient = useQueryClient();
  const {
    data: deposits,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['deposit', selectedRid],
    queryFn: () => depositService.getDepositByMemberId(selectedRid as string),
    enabled: !!isOpen && !!selectedRid, // Only run query when modal is open and id is present
  });

  const handleAmountChange = async (depositId: string, newAmount: string) => {
    try {
      const result = await axiosInstance.patch(`/deposits/${depositId}`, {
        amount: newAmount,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
      queryClient.invalidateQueries({ queryKey: ['deposit', selectedRid] });
      if (result?.data?.statusText === 'SUCCESS') {
        Swal.fire({
          title: `${newAmount} Tk`,
          text: `${result?.data?.message}`,
          icon: 'success',
        });
      }
    } catch (error) {
      Swal.fire({
        title: `Failed`,
        text: 'Update failed ❌',
        icon: 'error',
      });
      console.error('', error);
    }
  };

  if (!isOpen || !selectedRid) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex justify-between items-center border-b border-blue-600 pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Deposit Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {isError && <p className="text-center text-red-500">Failed to fetch deposits.</p>}

        {deposits && (
            
          <div className="space-y-4">
            {/* Member Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {deposits.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {deposits.email}
              </p>
              <p>
                <span className="font-semibold">Total Deposit:</span> {deposits.total_deposit} Tk
              </p>
            </div>

            {/* Deposit List */}
            <div>
              <h4 className="mt-2 mb-2 font-medium text-gray-700">Deposit History</h4>
              <div className="max-h-60 overflow-y-auto border border-blue-600 rounded-lg p-3">
                <ul className="divide-y divide-gray-200">
                  {/* Header Row */}
                  <li className="flex items-center justify-between py-2 text-sm font-semibold text-gray-900 bg-gray-100 rounded">
                    <span className="w-1/3">Created At</span>
                    <span className="w-1/3">Amount</span>
                  </li>

                  {/* Deposit Rows */}
                  {deposits.deposit_details?.map((d: any) => (
                    <li
                      key={d.rid}
                      className="flex items-center justify-between py-2 text-sm text-gray-700"
                    >
                      {/* Created Date */}
                      <span className="w-1/3">{d.created_date}</span>

                      {/* Amount Input */}
                      <input
                        type="number"
                        defaultValue={d.amount}
                        className="w-1/3 border px-2 py-1 rounded"
                        onChange={(e) => handleAmountChange(d.rid, e.target.value)}
                      />
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

export default UpdateDepositModal;
