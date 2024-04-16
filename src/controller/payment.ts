import { Request, Response } from "express";
import { stripe } from "../app";

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Send PaymentIntent client secret as response
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Error creating PaymentIntent' });
  }
};
