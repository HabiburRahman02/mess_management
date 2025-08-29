'use client';
import { useQuery } from '@tanstack/react-query';
import { mealService } from '@/services/mealService';

type MealModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedMemberId: string | null;
};

const MealDetailModal: React.FC<MealModalProps> = ({ isOpen, onClose, selectedMemberId }) => {
  const {
    data: meals,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['meal', selectedMemberId],
    queryFn: () => mealService.getMealByMemberId(selectedMemberId),
    enabled: !!isOpen && !!selectedMemberId, // Only run query when modal is open and id is present
  });

  if (!isOpen || !selectedMemberId) return null;

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
        {isError && <p className="text-center text-red-500">Failed to fetch deposit details.</p>}

        {meals ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <span className="font-semibold">Name:</span> {meals.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {meals.email}
              </p>
              <p>
                <span className="font-semibold">Total Meal:</span> {meals.total_meals}
              </p>
              <p>
                <span className="font-semibold">Meal Month:</span> {meals.meal_month}
              </p>
            </div>

            <div>
              <h4 className="mt-2 mb-2 font-medium text-gray-700">Meals History</h4>
              <div className="max-h-60 overflow-y-auto border border-sky-600 rounded-lg p-3">
                <ul className="divide-y divide-gray-200">
                  {/* Header Row */}
                  <li className="grid grid-cols-5 gap-2 py-2 text-sm font-semibold text-gray-900 bg-gray-100">
                    <span className="text-left">Meal Date</span>
                    {/* <span className="text-left">Meal Date</span> */}
                    <span className="text-left">Meal Time</span>
                    <span className="text-left">Updated Date</span>
                    <span className="text-left">Updated Time</span>
                    <span className="text-right">Meal Count</span>
                  </li>

                  {/* Data Rows */}
                  {meals.meal_details?.map(
                    (
                      d: {
                        meal_date: string;
                        meal_count: string;
                        // created_date: string;
                        created_time: string;
                        updated_date: string;
                        updated_time: string;
                      },
                      idx: number,
                    ) => (
                      <li key={idx} className="grid grid-cols-5 gap-2 py-2 text-sm text-gray-700">
                        <span className="text-left">{d.meal_date}</span>
                        {/* <span className="text-left">{d.created_date}</span> */}
                        <span className="text-left">{d.created_time}</span>
                        <span className="text-left">{d.updated_date}</span>
                        <span className="text-left">{d.updated_time}</span>
                        <span className="text-right font-semibold">{d.meal_count}</span>
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

export default MealDetailModal;
