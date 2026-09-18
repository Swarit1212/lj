import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

let razorpayInstance = null;

if (keyId && keySecret) {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export const getRazorpayInstance = () => {
  return razorpayInstance;
};

export const getRazorpayKeyId = () => {
  return process.env.RAZORPAY_KEY_ID || "";
};

export default razorpayInstance;
