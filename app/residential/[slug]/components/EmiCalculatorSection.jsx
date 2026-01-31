"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

export default function EmiCalculatorSection() {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(30);
  const [showLoanPopup, setShowLoanPopup] = useState(false);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;

    if (!P || !r || !n) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emiValue =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPay = emiValue * n;
    const interest = totalPay - P;

    return {
      emi: emiValue,
      totalInterest: interest,
      totalPayment: totalPay,
    };
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (num) =>
    `₹ ${num.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <>
      {/* ================= EMI CALCULATOR ================= */}
      <section id="emi" className="max-w-[1240px] mx-auto px-4 mt-14">
        <h2 className="text-xl font-semibold mb-6">EMI Calculator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#F6FAFF] p-6 rounded-xl">

          {/* RIGHT */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Break-up of Total Payment
            </h3>

            <Image
              src="/images/emi-chart.png"
              alt="EMI Breakup Chart"
              width={360}
              height={260}
              className="object-contain"
            />

            <div className="flex gap-8 mt-6 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#9C6A1E]" />
                <span>Total interest</span>
              </span>

              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F1D2A2]" />
                <span>Principal loan amount</span>
              </span>
            </div>
          </div>

          {/* LEFT */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm text-gray-600">Loan Amount</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(+e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(+e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(+e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md outline-none"
              />
            </div>

            {/* RESULTS */}
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-2xl font-bold text-[#F5A300]">
                {formatCurrency(emi)}
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <span>Interest to be paid</span>
              <span className="font-medium">
                {formatCurrency(totalInterest)}
              </span>
            </div>

            <div className="flex justify-between text-sm border-t pt-2">
              <span>Total of Payments</span>
              <span className="font-semibold">
                {formatCurrency(totalPayment)}
              </span>
            </div>

            <button
              onClick={() => setShowLoanPopup(true)}
              className="w-full mt-4 bg-[#F5A300] text-white py-2.5 rounded-lg font-semibold hover:bg-[#e29500]"
            >
              Get Loan
            </button>
          </div>
        </div>
      </section>

      {/* ================= POPUP ================= */}
      {showLoanPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setShowLoanPopup(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-2">
              Apply for Loan
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Our loan expert will contact you shortly.
            </p>

            <div className="space-y-3">
              <input placeholder="Full Name" className="w-full px-4 py-2 border rounded-md" />
              <input placeholder="Phone Number" className="w-full px-4 py-2 border rounded-md" />
              <input placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
            </div>

            <button className="w-full mt-5 bg-[#F5A300] text-white py-2.5 rounded-lg font-semibold">
              Submit Request
            </button>
          </div>
        </div>
      )}
    </>
  );
}
