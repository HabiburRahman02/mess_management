'use client';
import React, { useState } from 'react';

import { depositService } from '@/services/depositService';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineEye } from 'react-icons/ai';
import AddDepositModal from './components/AddDepositModal';
import { FaEdit } from 'react-icons/fa';
import DepositDetailModal from './components/DepositDetailModal';
import UpdateDepositModal from './components/UpdateDepositModal';

type Deposit = {
  rid: string;
  name: string;
  email: string;
  total_deposit: number;
};

const Deposits: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRid, setSelectedRid] = useState<string | null>(null);

  const {
    data: deposits,
    isLoading,
    isError,
    error,
  } = useQuery<Deposit[]>({
    queryKey: ['deposits'],
    queryFn: depositService.getDeposits,
  });

    console.log('DEPOSIT', deposits)

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      {/* Add Deposit Modal */}
      <AddDepositModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* deposit modal */}
      <DepositDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedId={selectedId}
      ></DepositDetailModal>

      {/* Update modal */}
      <UpdateDepositModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedRid={selectedRid}
      ></UpdateDepositModal>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deposits</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Deposit
        </button>
      </div>
      <div className="overflow-x-auto border border-blue-600 rounded-lg">
        <table className="w-full divide-y divide-gray-200 text-left text-sm max-w-sm sm:max-w-xl md:max-w-full">
          <thead className="sticky top-0 z-10 bg-blue-50 text-gray-700">
            <tr>
              <th className="bg-blue-50 px-4 py-4">No.</th>
              <th className="bg-blue-50 px-4 py-4">Full Name</th>
              <th className="bg-blue-50 px-4 py-4">Email</th>
              <th className="bg-blue-50 px-4 py-4">Deposit Total</th>
              <th className="bg-blue-50 px-4 py-4">Action</th>
            </tr>
          </thead>
          {isLoading ? (
            <div>
              <h1 className="flex justify-between text-center">Loading...</h1>
            </div>
          ) : (
            <tbody className="divide-y divide-gray-100">
              {deposits?.map((deposit, idx) => (
                <tr key={deposit.rid} className="hover:bg-blue-50">
                  <td className="whitespace-nowrap px-4 py-4">{idx + 1}</td>
                  <td className="whitespace-nowrap px-4 py-4">{deposit.name || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{deposit.email || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{deposit.total_deposit || 'N/A'} TK</td>
                  {/* Action Column */}
                  <td className="whitespace-nowrap px-4 py-4 text-center flex gap-3 items-center">
                    <button
                      onClick={() => {
                        setSelectedId(deposit.rid);
                        setIsModalOpen(true);
                      }}
                      className="text-green-600 hover:text-green-800 flex items-center justify-center cursor-pointer"
                    >
                      <AiOutlineEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRid(deposit.rid);
                        setIsUpdateModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center cursor-pointer"
                    >
                      <FaEdit  />
                    </button>
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

export default Deposits;
