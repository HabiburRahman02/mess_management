'use client';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import InputField from '@/components/common/InputField';
import Swal from 'sweetalert2';

type AddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !address) return;
    const newMember = { name, email, address, phone };
    console.log('newMember', newMember);
    try {
      const res = await memberService.addMember(newMember);
      console.log('res', res);
      if (res?.statusText === 'SUCCESS') {
        Swal.fire({
          title: `Congratulation!`,
          text: `Now ${name} is new member in you mess`,
          icon: 'success',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
      setName('');
      setEmail('');
      setAddress('');
      setPhone('');
      onClose();
      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (error) {
      Swal.fire({
        title: `Failed`,
        text: `Failed to add member`,
        icon: 'error',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm md:max-w-xl rounded bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Member</h2>

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
            placeholder="Enter member address"
            required
          />
          <InputField
            label="Phone"
            value={phone}
            type="number"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
