"use client";
import Image from "next/image";
import { useState } from "react";

export default function PaymentCard({ title, description, amount, onPay }) {
    const [processing, setProcessing] = useState(false);

    const handlePay = async () => {
        setProcessing(true);
        await onPay(amount, () => setProcessing(false));
    };

    return (
        <div className="shadow-sm rounded-lg border p-2 hover:scale-105 transition-all mt-4">
            <Image
                src="/payments.png"
                alt={title}
                width={300}
                height={200}
                className="w-full h-[200px] object-cover rounded-lg"
            />
            <div className="p-2">
                <h2 className="font-medium text-lg flex justify-between">
                    {title}
                </h2>
                <p className="text-sm text-gray-400 my-1">{description}</p>

                {/* Big Amount */}
                <div className="text-2xl font-semibold text-primary mt-2 mb-3">
                    ₹{amount}
                </div>

                <button
                    onClick={handlePay}
                    disabled={processing}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {processing ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
}
