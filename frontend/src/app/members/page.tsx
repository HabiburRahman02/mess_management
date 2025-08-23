'use client';

import { memberService } from '@/services/memberService';
import { useQuery } from '@tanstack/react-query';
import { FaEdit } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';

type Member = {
  rid: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

const Members: React.FC = () => {
  const {
    data: members,
    isLoading,
    isError,
    error,
  } = useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: memberService.getMembers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Members</h1>
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
                    <button className="text-green-600 hover:text-green-800 flex items-center justify-center cursor-pointer">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800 flex items-center justify-center cursor-pointer">
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
