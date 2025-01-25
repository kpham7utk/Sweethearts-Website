import React, { useState } from 'react';

interface ClassData {
  id: number;
  title: string;
  date: string;
  time: string;
  spots: number;
  price: number;
  description: string;
}

interface RegistrationFormProps {
  classData: ClassData;
  onSubmit: (formData: RegistrationFormData) => void;
  onCancel: () => void;
}

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  participants: number;
  specialRequirements?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ classData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    specialRequirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Participants</label>
        <select
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: Number(e.target.value) })}
        >
          {[...Array(classData.spots)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
          value={formData.specialRequirements}
          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Proceed to Payment
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;