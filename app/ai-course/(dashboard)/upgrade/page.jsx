"use client";
import { useState } from "react";
import Script from "next/script";
import PaymentCard from "./_components/PaymentCard";

export default function PaymentPage() {
  const handlePayment = async (amount, stopLoading) => {
    try {
      const res = await fetch("/ai-course/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Your Company Name",
        description: `${amount} INR plan`,
        order_id: data.orderID,
        handler: async function (response) {
          const verifyRes = await fetch("/ai-course/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment verified successfully!");
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "8861060406",
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed!");
    } finally {
      stopLoading();
    }
  };

  return (
    <div >
      <h2 className='font-bold text-3xl'>Create More Courses</h2>
      <p>Upgrade to the plan of your convineance</p>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <PaymentCard
          title="Basic Plan"
          description="Payment for basic tier"
          amount={100}
          onPay={handlePayment}
          imgurl={"/payments.png"}
        />
        <PaymentCard
          title="Premium Plan"
          description="For premium tier"
          amount={399}
          onPay={handlePayment}
          imgurl={"/businesspayments.jpg"}
        />
        <PaymentCard
          title="Premium Plus Plan"
          description="For enterprise tier"
          amount={999}
          onPay={handlePayment}
          imgurl={"/premiumpayments.jpg"}
        />
      </div>
    </div>
  );
}
