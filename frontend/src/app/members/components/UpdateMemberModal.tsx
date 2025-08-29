import axiosInstance from '@/api/axiosInstance';
import InputField from '@/components/common/InputField';
import InputSelect from '@/components/common/InputSelect';
import { memberService } from '@/services/memberService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type UpdateMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memberId?: string; // selected member id
};

 const statusOptions = [
    { value: '', label: 'Status Change' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];


const UpdateMemberModal: React.FC<UpdateMemberModalProps> = ({ isOpen, onClose, memberId }) => {
  const queryClient = useQueryClient();

  // Fetch all members
  const { data: members, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getMembers,
  });

  // Find selected member
  const selectedMember = members?.find((m: any) => m.rid === memberId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');


  // Set state when modal opens
  useEffect(() => {
    if (selectedMember) {
      setName(selectedMember.name);
      setEmail(selectedMember.email);
      setAddress(selectedMember.address);
      setPhone(selectedMember.phone);
      setStatus(selectedMember.status);
    }
  }, [selectedMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMember = { name, email, address, phone, status };
    try {
      const res = await axiosInstance.patch(`/members/${memberId}`, updatedMember);
      console.log('RESULT', res);
      refetch();
      onClose();
      if (res.data?.statusText === 'SUCCESS') {
        Swal.fire({
          title: `Update Member!`,
          text: `Now ${name} is updated successfully`,
          icon: 'success',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        title: `Failed`,
        text: `Failed to update member`,
        icon: 'error',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm md:max-w-xl rounded bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Update Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter member name"
            required
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter member email"
            required
          />
          <InputField
            label="Address"
            type="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter member email"
            required
          />
          <InputField
            label="Phone"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter member phone"
            required
          />
          <InputSelect
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            required={true}
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMemberModal;
