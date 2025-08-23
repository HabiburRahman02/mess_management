'use client';
import { useQuery } from '@tanstack/react-query';
import { depositService } from '@/services/depositService';

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
};

const DepositDetailModal: React.FC<DepositModalProps> = ({ isOpen, onClose, selectedId }) => {
  // API call for single deposit by id
  const {
    data: deposits,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['deposit', selectedId],
    queryFn: () => depositService.getDepositByMemberId(selectedId as string),
    enabled: !!isOpen && !!selectedId, // Only run query when modal is open and id is present
  });

  console.log('DEP', deposits)
  if (!isOpen || !selectedId) return null;

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
        {isError && <p className="text-center text-red-500">Failed to fetch deposit details.</p>}

        {deposits ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div>
              <h4 className="mt-2 mb-2 font-medium text-gray-700">Deposit History</h4>
              <div className="max-h-60 overflow-y-auto border border-blue-600 rounded-lg p-3">
                <ul className="divide-y divide-gray-200">
                  {/* Header Row */}
                  <li className="grid grid-cols-5 gap-2 py-2 text-sm font-semibold text-gray-900 bg-gray-100">
                    <span className="text-left">Created Date</span>
                    <span className="text-center">Created Time</span>
                    <span className="text-left">Updated Date</span>
                    <span className="text-center">Updated Time</span>
                    <span className="text-right">Amount</span>
                  </li>

                  {/* Data Rows */}
                  {deposits.deposit_details?.map(
                    (
                      d: {
                        amount: string;
                        created_date: string;
                        created_time: string;
                        updated_date: string;
                        updated_time: string;
                      },
                      idx: number,
                    ) => (
                      <li key={idx} className="grid grid-cols-5 gap-2 py-2 text-sm text-gray-700">
                        <span className="text-left">{d.created_date}</span>
                        <span className="text-center">{d.created_time}</span>
                        <span className="text-left">{d.updated_date}</span>
                        <span className="text-center">{d.updated_time}</span>
                        <span className="text-right font-semibold">{d.amount} Tk</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No details found.</p>
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

export default DepositDetailModal;
