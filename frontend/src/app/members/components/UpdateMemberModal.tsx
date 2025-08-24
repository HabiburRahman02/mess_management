import InputField from '@/components/common/InputField';
import { memberService } from '@/services/memberService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type UpdateMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memberId?: string; // selected member id
};

const UpdateMemberModal: React.FC<UpdateMemberModalProps> = ({ isOpen, onClose, memberId }) => {
  const queryClient = useQueryClient();

  // Fetch all members
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getMembers,
  });

  // Find selected member
  const selectedMember = members?.find((m: any) => m.rid === memberId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Set state when modal opens
  useEffect(() => {
    if (selectedMember) {
      setName(selectedMember.name);
      setEmail(selectedMember.email);
      setPhone(selectedMember.phone);
    }
  }, [selectedMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMember = { name, email, phone };
    console.log(updatedMember);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm md:max-w-md rounded bg-white p-6 shadow-lg">
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
            label="Phone"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter member phone"
            required
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
