"use client";

import { useState, useMemo } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EmiCalculatorSection({ propertyTitle = "N/A" }) {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(30);
  const [showLoanPopup, setShowLoanPopup] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ NEW STATES */
  const [errors, setErrors] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);

  /* ================= EMI CALC ================= */
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

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!/^[6-9]\d{9}$/.test(phone))
      newErrors.phone = "Enter valid 10 digit phone";

    if (email && !/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Enter valid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleLoanSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "contacts"), {
        name,
        phone,
        email,
        propertyTitle,
        source: "EMI Calculator Popup",
        loanAmount,
        interestRate,
        tenure,
        createdAt: serverTimestamp(),
      });

      /* ✅ THANK YOU POPUP */
      setShowThankYou(true);

      setTimeout(() => {
        setShowThankYou(false);
        setShowLoanPopup(false);
      }, 2000);

      setName("");
      setPhone("");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= EMI CALCULATOR ================= */}
      <section id="emi" className="max-w-[1240px] mx-auto px-4 mt-14">
        <h2 className="text-xl font-semibold mb-6">EMI Calculator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#F6FAFF] p-6 rounded-xl">

          {/* RIGHT GRAPH */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Break-up of Total Payment
            </h3>
          </div>

          {/* LEFT */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm text-gray-600">Loan Amount</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(+e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md"
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
                className="w-full mt-1 px-4 py-2 border rounded-md"
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
                className="w-full mt-1 px-4 py-2 border rounded-md"
              />
            </div>

            <button
              onClick={() => setShowLoanPopup(true)}
              className="w-full mt-4 bg-[#F5A300] text-white py-2.5 rounded-lg font-semibold"
            >
              Get Loan
            </button>
          </div>
        </div>
      </section>

      {/* ================= POPUP ================= */}
      {showLoanPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          {/* ✅ THANK YOU */}
          {showThankYou && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              <div className="bg-white rounded-xl px-6 py-5 text-center shadow-xl">
                <h3 className="text-lg font-semibold text-[#c8950a]">
                  Thank You 🙌
                </h3>
                <p className="text-sm mt-1">
                  Our team will contact you shortly.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setShowLoanPopup(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-1">
              Apply for Loan
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Property: <span className="font-medium">{propertyTitle}</span>
            </p>

            <div className="space-y-3">
              <div>
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleLoanSubmit}
              disabled={loading}
              className="w-full mt-5 bg-[#F5A300] text-white py-2.5 rounded-lg font-semibold"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

