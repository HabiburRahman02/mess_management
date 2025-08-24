'use client';

import { memberService } from '@/services/memberService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import AddMemberModal from './components/AddMemberModal';
import Swal from 'sweetalert2';
import UpdateMemberModal from './components/UpdateMemberModal';

type Member = {
  rid: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

const Members: React.FC = () => {
  const [memberId, setMemberId] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: members,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: memberService.getMembers,
  });

  const handleDeleteMember = async (rid: string) => {
    queryClient.invalidateQueries({ queryKey: ['members'] });
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this member',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteResult = await memberService.deleteMember(rid);

          queryClient.invalidateQueries({ queryKey: ['members'] });

          if (deleteResult.success) {
            Swal.fire({
              title: 'Deleted!',
              text: deleteResult.message,
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'Delete Failed!',
              text: deleteResult.message,
              icon: 'error',
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'This member already deposit. thats why you can not delete',
            icon: 'error',
          });
        }
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      ></AddMemberModal>
      {/* Update Member Modal */}
      <UpdateMemberModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        memberId={memberId}
      ></UpdateMemberModal>
      {/* Member Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Total</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          Add New
        </button>
      </div>
      <div className="overflow-x-auto border border-blue-600 rounded-lg">
        <table className="w-full divide-y divide-gray-200 text-left text-sm max-w-sm sm:max-w-xl md:max-w-full">
          <thead className="sticky top-0 z-10 bg-blue-50 text-gray-700">
            <tr>
              <th className="bg-blue-50 px-4 py-4">No.</th>
              <th className="bg-blue-50 px-4 py-4">Full Name</th>
              <th className="bg-blue-50 px-4 py-4">Email</th>
              <th className="bg-blue-50 px-4 py-4">Phone No.</th>
              <th className="bg-blue-50 px-4 py-4">Joining Date</th>
              <th className="bg-blue-50 px-4 py-4">Action</th>
            </tr>
          </thead>
          {isLoading ? (
            <div>
              <h1 className="flex justify-between text-center">Loading...</h1>
            </div>
          ) : (
            <tbody className="divide-y divide-gray-100">
              {members?.map((member, idx) => (
                <tr key={member.rid} className="hover:bg-blue-50">
                  <td className="whitespace-nowrap px-4 py-4">{idx + 1}</td>
                  <td className="whitespace-nowrap px-4 py-4">{member.name || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{member.email || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">{member.phone || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {member.created_at
                      ? new Date(member.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>

                  {/* Action Column */}
                  <td className=" gap-2 whitespace-nowrap px-4 py-4 text-center flex items-center">
                    <button
                      onClick={() => {
                        setMemberId(member.rid);
                        setIsUpdateModalOpen(true);
                      }}
                      className="text-sky-600 hover:text-sky-800 flex items-center justify-center cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.rid)}
                      className="text-red-600 hover:text-red-800 flex items-center justify-center cursor-pointer"
                    >
                      <FaDeleteLeft />
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

export default Members;
