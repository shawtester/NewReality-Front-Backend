"use client";

export default function PaymentPlanSection({ paymentPlan = [] }) {
  if (!paymentPlan || paymentPlan.length === 0) return null;

  return (
    <section
      id="payment-plan"
      className="max-w-[1240px] mx-auto px-4 mt-16"
    >
      <h2 className="text-xl font-semibold mb-6">
        Payment Plan
      </h2>

      <div className="bg-[#FBF6F1] rounded-2xl px-6 py-10">
        {/* 🔥 HORIZONTAL SCROLL */}
        <div className="flex overflow-x-auto gap-8 no-scrollbar">
          {paymentPlan.map((p, i) => (
            <div
              key={i}
              className="min-w-[220px] text-center border-r last:border-0 pr-6"
            >
              <p className="text-lg font-medium mb-4">
                {p.title}
              </p>

              <p className="text-2xl font-semibold mb-2">
                {p.percent}
              </p>

              <p className="text-sm text-gray-600">
                {p.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
