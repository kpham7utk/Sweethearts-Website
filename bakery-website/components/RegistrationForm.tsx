import React, { useState, useEffect } from 'react';
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

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  participants: number;
  specialRequirements?: string;
}

interface RegistrationFormProps {
  classData: ClassData;
  onSubmit: (data: RegistrationData) => void; // Define RegistrationData type
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  participants?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ classData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [card, setCard] = useState<any>(null);

  // Initialize Square card when component mounts
  useEffect(() => {
    const initializeCard = async () => {
      try {
        const payments = await loadSquareSdk();
        const cardInstance = await payments.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } catch (err) {
        console.error('Error initializing Square card:', err);
      }
    };
  
    initializeCard();
    
    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, [card]); // Add card to dependency array

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Name validation
    if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Participants validation
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
      if (!card) {
        throw new Error('Payment form not initialized');
      }

      // Get payment token
      const result = await card.tokenize();
      console.log('Tokenization result:', result);
      
      if (result.status === 'OK') {
        const response = await fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            classId: classData.id,
            customerInfo: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
            participants: formData.participants,
            amount: classData.price * formData.participants,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        onSubmit(data);
      } else {
        console.error('Tokenization errors:', result.errors);
        throw new Error(result.errors?.[0]?.detail || 'Payment tokenization failed');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An unexpected error occurred');
      console.error('Payment error:', error);
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