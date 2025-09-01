'use client';

import { mealRateService } from '@/services/mealRateService';
import { monthString } from '@/utils/currentMonth';
import { useQuery } from '@tanstack/react-query';

type MemberStatsProps = {
  member_id: string;
  member_name: string;
  member_email: string;
  total_meals: string | number;
  total_deposit: string | number;
  meal_rate: string | number;
  balance: string | number;
};

const MealRatePerMember = () => {
  const {
    data: mealRatePerMembers,
    isLoading,
    isError,
    error,
  } = useQuery<MemberStatsProps[]>({
    queryKey: ['/meal-rate/single-meal-stats'],
    queryFn: () => mealRateService.getMealStatsPerMember(monthString),
  });

  console.log('meal rate', mealRatePerMembers);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meal Rate this month per member</h1>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Meals
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Deposit
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
               <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance (Decimal)
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {mealRatePerMembers?.map((member) => (
                <tr key={member.member_id} className="hover:bg-gray-50">
                  {/* Member First Letter Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-sky-700 text-white rounded-full font-semibold">
                        {member?.member_name?.[0].toUpperCase() || '?'}
                      </div>
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                    {member?.member_name || 'N/A'}
                  </td>

                  {/* Total Meals */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {member.total_meals || 'N/A'}
                  </td>

                  {/* Total Deposit */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {member.total_deposit || 'N/A'} Tk.
                  </td>

                  {/* Balance */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-medium ${
                      Number(member.balance) > 0
                        ? 'text-sky-700'
                        : Number(member.balance) < 0
                          ? 'text-red-700'
                          : 'text-gray-700'
                    }`}
                  >
                    {member.balance || '0'} Tk.
                  </td>
                  {/* Rounded Balance */}
                  {/* Custom Rounded Balance */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-medium ${
                      Number(member.balance) > 0
                        ? 'text-sky-700'
                        : Number(member.balance) < 0
                          ? 'text-red-700'
                          : 'text-gray-700'
                    }`}
                  >
                    {member.balance
                      ? Number(member.balance) < 0
                        ? Math.floor(Number(member.balance)) // Negative always floor
                        : Math.ceil(Number(member.balance)) // Positive always ceil
                      : 0}{' '}
                    Tk.
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

export default MealRatePerMember;
