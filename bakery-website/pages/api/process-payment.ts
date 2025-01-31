import { pool } from '../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { SquareClient} from 'square';

interface PaymentRequest {
  sourceId: string;
  classId: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  participants: number;
  amount: number;
}

const square = require('square');
const squareClient = new square.Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: 'sandbox' // or 'production' for live
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sourceId, classId, customerInfo, participants, amount }: PaymentRequest = req.body;

    // Start a database transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if spots are still available
      const { rows: [classDetails] } = await client.query(
        'SELECT spots_remaining FROM classes WHERE id = $1 FOR UPDATE',
        [classId]
      );

      if (!classDetails || classDetails.spots_remaining < participants) {
        throw new Error('Not enough spots available');
      }

      // Process payment with Square
      const payment = await squareClient.paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)),
          currency: 'USD'
        },
        idempotencyKey: `${classId}-${Date.now()}-${Math.random()}`,
        buyerEmailAddress: customerInfo.email,
      });

      if (payment?.result?.payment?.status === 'COMPLETED') {
        // Update spots and create registration
        await client.query(
          'UPDATE classes SET spots_remaining = spots_remaining - $1 WHERE id = $2',
          [participants, classId]
        );

        const { rows: [registration] } = await client.query(
          `INSERT INTO registrations (
            class_id,
            square_payment_id,
            payment_status,
            customer_email,
            customer_name,
            customer_phone,
            participants
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
          [
            classId,
            payment.result.payment.id,
            'completed',
            customerInfo.email,
            customerInfo.name,
            customerInfo.phone,
            participants
          ]
        );

        await client.query('COMMIT');
        return res.status(200).json({ success: true, registration });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process registration' 
    });
  }
}