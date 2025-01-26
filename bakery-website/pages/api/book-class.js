import { createRegistration, updateClassSpots, getClassById } from '../../lib/db';
import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox // Change to Production when ready
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { classId, paymentToken, customerInfo, participants } = req.body;

    // Get class details
    const classDetails = await getClassById(classId);
    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Calculate total amount
    const amount = classDetails.price * participants;

    // Process payment with Square
    const payment = await squareClient.paymentsApi.createPayment({
      sourceId: paymentToken,
      amountMoney: {
        amount: amount * 100, // Square expects amount in cents
        currency: 'USD'
      },
      idempotencyKey: `${classId}-${Date.now()}`
    });

    if (payment.result.payment.status === 'COMPLETED') {
      // Update class spots
      const updatedClass = await updateClassSpots(classId, participants);
      if (!updatedClass) {
        // Handle case where not enough spots are available
        // You should refund the payment here
        return res.status(400).json({ message: 'Not enough spots available' });
      }

      // Create registration
      const registration = await createRegistration({
        classId,
        squarePaymentId: payment.result.payment.id,
        paymentStatus: 'completed',
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        participants
      });

      return res.status(200).json({ 
        success: true, 
        registration,
        payment: payment.result.payment 
      });
    }

    res.status(400).json({ message: 'Payment failed' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
}