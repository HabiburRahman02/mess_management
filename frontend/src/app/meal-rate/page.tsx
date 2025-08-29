'use client';
import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { AiOutlineEye } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { mealService } from '@/services/mealService';
import { mealRateService } from '@/services/mealRateService';

type MealRate = {
  month: string;
  total_bazar_cost: string;
  total_meals: string;
  meal_rate: string;
};

const role = 'manager';

const Meals: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberMealId, setSelectedMemberMealId] = useState<string | null>(null);

  const {
    data: mealRate,
    isLoading,
    isError,
    error,
  } = useQuery<MealRate[]>({
    queryKey: ['meal-rate'],
    queryFn: mealRateService.getMealRate,
  });

  console.log('meal rate', mealRate);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meal Rate this month</h1>
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
              <th className="bg-blue-50 px-4 py-4">-</th>
              <th className="bg-blue-50 px-4 py-4">Month</th>
              <th className="bg-blue-50 px-4 py-4">Total Bazar Cost</th>
              <th className="bg-blue-50 px-4 py-4">Total Meal</th>
              <th className="bg-blue-50 px-4 py-4">Meal Rate</th>
            </tr>
          </thead>
          {isLoading ? (
            <div>
              <h1 className="flex justify-between text-center">Loading...</h1>
            </div>
          ) : (
            <tbody className="divide-y divide-gray-100">
              {mealRate?.map((meal, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="whitespace-nowrap px-4 py-4">*</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal?.month || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal.total_bazar_cost || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal.total_meals || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{meal.meal_rate || 'N/A'}</td>
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
