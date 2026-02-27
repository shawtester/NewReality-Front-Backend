"use client";

import { useState, useMemo, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Country codes array from our previous conversation
const countryCodes = [
  { code: "+1", label: "🇺🇸 USA" },
  { code: "+1", label: "🇨🇦 Canada" },
  { code: "+44", label: "🇬🇧 UK" },
  { code: "+91", label: "🇮🇳 India" },
  { code: "+61", label: "🇦🇺 Australia" },
  { code: "+49", label: "🇩🇪 Germany" },
  { code: "+33", label: "🇫🇷 France" },
  { code: "+81", label: "🇯🇵 Japan" },
  { code: "+55", label: "🇧🇷 Brazil" },
  { code: "+86", label: "🇨🇳 China" },
  { code: "+39", label: "🇮🇹 Italy" },
  { code: "+52", label: "🇲🇽 Mexico" },
  { code: "+7", label: "🇷🇺 Russia" },
  { code: "+82", label: "🇰🇷 South Korea" },
  { code: "+34", label: "🇪🇸 Spain" },
  { code: "+971", label: "🇦🇪 UAE" }
];

export default function EmiCalculatorSection({ propertyTitle = "N/A" }) {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(30);
  const [showLoanPopup, setShowLoanPopup] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ NEW STATES */
  const [errors, setErrors] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showLoanPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoanPopup]);

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

  /* ================= DONUT ================= */
  const interestPercent =
    totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const principalPercent = 100 - interestPercent;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const interestStroke = (interestPercent / 100) * circumference;
  const principalStroke = circumference - interestStroke;

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    // Updated phone validation - check only digits after country code (8-15 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 8 || phoneDigits.length > 15) {
      newErrors.phone = "Enter valid phone number (8-15 digits)";
    }

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
        phone: `${countryCode}${phone}`, // Combine country code + phone
        email,
        propertyTitle,
        source: "EMI Calculator Popup",
        loanAmount,
        interestRate,
        tenure,
        createdAt: serverTimestamp(),
      });

      // Clear form
      setName("");
      setPhone("");
      setEmail("");
      setCountryCode("+91"); // Reset to default

      // 🔥 CLOSE FORM FIRST
      setShowLoanPopup(false);

      // 🔥 SHOW THANK YOU AFTER CLOSE
      setTimeout(() => setShowThankYou(true), 150);
      setTimeout(() => setShowThankYou(false), 2200);

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

            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={radius} fill="none" stroke="#F1D2A2" strokeWidth="20" />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#9C6A1E"
                strokeWidth="20"
                strokeDasharray={`${interestStroke} ${principalStroke}`}
                transform="rotate(-90 100 100)"
              />
            </svg>

            <div className="flex gap-8 mt-6 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#9C6A1E]" />
                Interest ({interestPercent.toFixed(1)}%)
              </span>

              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F1D2A2]" />
                Principal ({principalPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* LEFT */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm text-gray-600">Loan Amount</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Loan Tenure (Years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(+e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md" />
            </div>

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
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setShowLoanPopup(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-1">Apply for Loan</h3>
            <p className="py-2">Our loan expert will contact you shortly</p>

            <div className="space-y-3">
              <input 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-2 border rounded-md" 
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

              {/* ✅ NEW PHONE INPUT WITH COUNTRY CODE */}
              <div className="flex gap-2">
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-28 px-3 py-2 border rounded-md text-sm bg-white flex items-center justify-between"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input 
                  placeholder="Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only digits
                  className="flex-1 px-4 py-2 border rounded-md" 
                  maxLength={15}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}

              <input 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-2 border rounded-md" 
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
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

      {/* ================= THANK YOU POPUP ================= */}
      {showThankYou && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl p-20 text-center shadow-xl animate-fadeIn">
            <h3 className="text-lg font-semibold text-[#c8950a]">
              Thank You 🙌
            </h3>
            <p className="text-sm mt-1">
              Our team will contact you shortly.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
