"use client";

export default function PaymentPlanSection({ paymentPlan }) {
  // ✅ SAFE ARRAY FIX
  const plans = Array.isArray(paymentPlan)
    ? paymentPlan
    : Object.values(paymentPlan || {});

  if (!plans.length) return null;

  /* ================= LAYOUT LOGIC ================= */

  const isSingle = plans.length === 1;
  const isDouble = plans.length === 2;
  const isScrollable = plans.length >= 3;

  return (
    <section
      id="payment-plan"
      className="max-w-[1240px] mx-auto px-4 mt-16"
    >
      <h2 className="text-xl font-semibold mb-6">
        Payment Plan
      </h2>

      <div className="bg-[#FBF6F1] rounded-2xl px-6 py-10">
        <div
          className={`
            flex gap-8
            ${isScrollable ? "overflow-x-auto" : ""}
            ${isSingle ? "justify-center" : ""}
            ${isDouble ? "justify-between" : ""}
          `}
          /* ✅ SCROLLBAR HIDE WITHOUT GLOBAL CSS */
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onScroll={(e) => {
            e.currentTarget.style.setProperty(
              "--webkit-scrollbar",
              "display:none"
            );
          }}
        >
          {/* 🔥 INLINE STYLE TAG (LOCAL ONLY) */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {plans.map((p, i) => (
            <div
              key={i}
              className={`
                text-center border-r last:border-0 pr-6
                ${isSingle ? "w-[260px]" : ""}
                ${isDouble ? "w-1/2" : "min-w-[220px]"}
              `}
            >
              <p className="text-lg font-medium mb-4">
                {p?.title}
              </p>

              <p className="text-2xl font-semibold mb-2">
                {p?.percent}
              </p>

              <p className="text-sm text-gray-600">
                {p?.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
