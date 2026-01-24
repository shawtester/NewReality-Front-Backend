"use client";

export default function PaymentPlanSection({ plans }) {
  // Fallback default plans (agar admin data na ho)
  const defaultPlans = [
    { title: "Installment 1", percent: "10%", note: "Down Payment" },
    { title: "Installment 2", percent: "80%", note: "During Construction" },
    { title: "Installment 3", percent: "10%", note: "Handover" },
  ];

  const paymentPlans = plans && plans.length ? plans : defaultPlans;

  return (
    <section
      id="payment-plan"
      className="max-w-[1240px] mx-auto px-4 mt-16"
    >
      <h2 className="text-xl font-semibold mb-6">Payment Plan</h2>

      <div className="bg-[#FBF6F1] rounded-2xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-8 md:gap-0">
          {paymentPlans.map((p, i) => (
            <div
              key={i}
              className={`${
                i !== paymentPlans.length - 1 ? "md:border-r" : ""
              }`}
            >
              <p className="text-lg font-medium mb-4">{p.title}</p>
              <p className="text-2xl font-semibold mb-2">{p.percent}</p>
              <p className="text-sm text-gray-600">{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
