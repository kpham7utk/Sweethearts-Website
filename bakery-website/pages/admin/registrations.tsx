import React, { useEffect, useState } from 'react';

interface Registration {
  id: number;
  class_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  participants: number;
  payment_status: string;
  created_at: string;
  class_details: {
    title: string;
    date: string;
    time: string;
  };
}

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Class Registrations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4">{reg.class_details.title}</td>
                  <td className="px-6 py-4">
                    {new Date(reg.class_details.date).toLocaleDateString()} at {reg.class_details.time}
                  </td>
                  <td className="px-6 py-4">{reg.customer_name}</td>
                  <td className="px-6 py-4">{reg.customer_email}</td>
                  <td className="px-6 py-4">{reg.customer_phone}</td>
                  <td className="px-6 py-4">{reg.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationsPage;