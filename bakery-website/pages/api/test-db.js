import { getAllClasses } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const classes = await getAllClasses();
    res.status(200).json(classes);
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
}