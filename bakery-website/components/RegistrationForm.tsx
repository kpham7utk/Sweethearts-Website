import React, { useState, useEffect, useRef } from 'react';
import { loadSquareSdk } from 'utils/squareUtils';

interface ClassData {
  id: number;
  title: string;
  description: string;
  price: number;
  max_spots: number;
  duration: number;
  date: string;
  time: string;
  spots_remaining: number;
  is_active: boolean;
}

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  participants: number;
  specialRequirements?: string;
}

interface RegistrationFormProps {
  classData: ClassData;
  onSubmit: (data: RegistrationFormData) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  participants?: string;
}

interface SquareCardInstance {
  attach(elementId: string): Promise<void>;
  tokenize(): Promise<{
    status: "OK" | "ERROR";
    token?: string;
    errors?: Array<{
      code: string;
      detail: string;
      field?: string;
    }>;
  }>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ classData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const cardRef = useRef<SquareCardInstance | null>(null);

  useEffect(() => {
    const initializeCard = async () => {
      try {
        const payments = await loadSquareSdk();
        const cardInstance = await payments.card();
        await cardInstance.attach('#card-container');
        cardRef.current = cardInstance;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize payment form');
      }
    };

    initializeCard();

    return () => {
      cardRef.current = null;
    };
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.participants < 1 || formData.participants > classData.spots_remaining) {
      errors.participants = `Please select between 1 and ${classData.spots_remaining} participants`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!cardRef.current) {
        throw new Error('Payment form not initialized');
      }

      const result = await cardRef.current.tokenize();
      if (result.status === 'OK' && result.token) {
        onSubmit(formData);
      } else {
        throw new Error(result.errors?.[0]?.detail || 'Payment tokenization failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {formErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Number of Participants</label>
        <input
          type="number"
          min="1"
          max={classData.spots_remaining}
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
          className={`w-full p-2 border rounded ${formErrors.participants ? 'border-red-500' : ''}`}
          required
          disabled={loading}
        />
        {formErrors.participants && (
          <p className="mt-1 text-sm text-red-600">{formErrors.participants}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Special Requirements (Optional)</label>
        <textarea
          value={formData.specialRequirements}
          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={loading}
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 font-medium">Payment Information</label>
        <div 
          id="card-container" 
          className="p-3 border rounded-md"
        ></div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay $${(classData.price * formData.participants).toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;