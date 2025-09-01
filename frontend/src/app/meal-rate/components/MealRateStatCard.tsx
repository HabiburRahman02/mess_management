// components/common/StatCard.tsx
'use client';
import React from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

const MealRateStatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div
      className="relative bg-gradient-to-r from-sky-50 to-white shadow-md rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 
    transition-transform duration-300 border border-sky-100"
    >
      {/* Icon */}
      {icon && <div className="flex justify-center mb-3 text-sky-500 text-3xl">{icon}</div>}

      {/* Title */}
      <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{title}</p>

      {/* Value */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-sky-600 mt-2">{value}</h2>
    </div>
  );
};

export default MealRateStatCard;
