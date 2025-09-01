'use client';
import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { AiOutlineEye } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { mealService } from '@/services/mealService';
import MealDetailModal from './components/MealDetailModal';
import AddMealModal from './components/AddMealModal';
import UpdateMealModal from './components/UpdateMealModal';
import { monthString } from '@/utils/currentMonth';

type Meal = {
  member_id: string;
  member_name: string;
  member_email: string;
  meal_month: string;
  total_meals: string;
};

const role = 'manager';

const Meals: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberMealId, setSelectedMemberMealId] = useState<string | null>(null);

  const {
    data: meals,
    isLoading,
    isError,
    error,
  } = useQuery<Meal[]>({
    queryKey: ['get-meals', ],
    queryFn: ()=> mealService.getMealsByMonth(monthString),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      {/* View Modal for meal detail */}
      <MealDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedMemberId={selectedMemberId}
      ></MealDetailModal>

      {/* Update meal modal */}
      <UpdateMealModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedMemberMealId={selectedMemberMealId}
      ></UpdateMealModal>

      {/* Add meal modal */}
      <AddMealModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}></AddMealModal>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meals</h1>
        {role === 'manager' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Add meals
          </button>
        )}
      </div>
      <div className="overflow-x-auto border border-blue-600 rounded-lg">
        <table className="w-full divide-y divide-gray-200 text-left text-sm max-w-sm sm:max-w-xl md:max-w-full">
          <thead className="sticky top-0 z-10 bg-blue-50 text-gray-700">
            <tr>
              <th className="bg-blue-50 px-4 py-4">No.</th>
              <th className="bg-blue-50 px-4 py-4">Full Name</th>
              <th className="bg-blue-50 px-4 py-4">Email</th>
              <th className="bg-blue-50 px-4 py-4">Month</th>
              <th className="bg-blue-50 px-4 py-4">Total Meals</th>
              <th className="bg-blue-50 px-4 py-4">Action</th>
            </tr>
          </thead>
          {isLoading ? (
            <div>
              <h1 className="flex justify-between text-center">Loading...</h1>
            </div>
          ) : (
            <tbody className="divide-y divide-gray-100">
              {meals?.map((meal, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="whitespace-nowrap px-4 py-4">{idx + 1}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal?.member_name || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal.member_email || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal.meal_month || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal.total_meals || 'N/A'}</td>
                  {/* Action Column */}
                  <td className="whitespace-nowrap px-4 py-4 text-center flex gap-3 items-center">
                    <button
                      onClick={() => {
                        setSelectedMemberId(meal.member_id);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-green-600 hover:text-green-800 flex items-center justify-center cursor-pointer"
                    >
                      <AiOutlineEye className="h-4 w-4" />
                    </button>
                    {role === 'manager' && (
                      <button
                        onClick={() => {
                          setSelectedMemberMealId(meal.member_id);
                          setIsUpdateModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Meals;
