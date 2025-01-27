import { pool } from '../../lib/db';

// First, let's clear existing classes
async function clearClasses() {
  await pool.query('DELETE FROM classes');
}

// Function to add multiple classes
async function addSampleClasses() {
  const classes = [
    {
      title: "Basic Cake Decorating",
      description: "Learn fundamental cake decorating techniques including frosting, piping, and basic flower creation.",
      price: 75.00,
      max_spots: 8,
      duration: 180,
      date: '2025-02-15',
      time: '10:00',
    },
    {
      title: "Wedding Cake Design",
      description: "Master the art of wedding cake design, from structure to elegant decorations.",
      price: 150.00,
      max_spots: 6,
      duration: 240,
      date: '2025-02-20',
      time: '14:00',
    },
    {
      title: "French Pastry Basics",
      description: "Introduction to classic French pastry techniques and recipes.",
      price: 95.00,
      max_spots: 10,
      duration: 180,
      date: '2025-03-05',
      time: '09:00',
    }
  ];

  for (const classData of classes) {
    await pool.query(`
      INSERT INTO classes (
        title,
        description,
        price,
        max_spots,
        duration,
        date,
        time,
        spots_remaining,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      classData.title,
      classData.description,
      classData.price,
      classData.max_spots,
      classData.duration,
      classData.date,
      classData.time,
      classData.max_spots,
      true
    ]);
  }
}

export default async function handler(req, res) {
  try {
    await clearClasses();
    await addSampleClasses();
    res.status(200).json({ message: 'Sample classes added successfully' });
  } catch (error) {
    console.error('Error adding sample classes:', error);
    res.status(500).json({ error: 'Failed to add sample classes' });
  }
}