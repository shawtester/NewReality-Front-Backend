const contact = {
  faqs: [
    {
      question: "Where is Prestige City Hyderabad located?",
      answer:
        "Simple gypsum board ceilings with recessed lights or cove lighting are the most commonly used because they are cost-effective, easy to install, and suit both small and large halls.",
    },
    {
      question: "What is the floor plan of Prestige City Hyderabad?",
      answer:
        "Yes, as long as the design is not too heavy or layered. A single-level false ceiling with clean lines and minimal drop can make a small hall look more structured and well-lit.",
    },
    {
      question:
        "What is the price range of the apartments in Prestige City Hyderabad?",
      answer:
        "Yes, as long as the design is not too heavy or layered. A single-level false ceiling with clean lines and minimal drop can make a small hall look more structured and well-lit.",
    },
  ],
};

export default function Faq() {
  return (
    <section className="bg-white px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 shadow-sm p-6">

        {/* Heading */}
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          FAQs
        </h3>

        {/* FAQ List */}
        <div className="divide-y divide-gray-200">
          {contact.faqs.map((faq, index) => (
            <details
              key={index}
              className="group py-4"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-800">
                <span className="pr-4">{faq.question}</span>

                <span className="text-lg text-gray-400 transition-transform duration-300 group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
