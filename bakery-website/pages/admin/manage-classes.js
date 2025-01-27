import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const response = await fetch('/api/test-db');
    const data = await response.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const response = await fetch(`/api/delete-class?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refresh the list after deletion
          fetchClasses();
        } else {
          alert('Error deleting class');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting class');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Classes</h1>
        <Link 
          href="/admin/add-class"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
        >
          Add New Class
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spots</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cls.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(cls.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cls.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cls.spots_remaining} / {cls.max_spots}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${cls.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}