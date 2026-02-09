export default function BigServices() {

  // ✅ DATA DIRECTLY HERE (no extra file)
  const bigServices = [
    {
      id: "invest",
      title: "Investment Advisory",
      text: "Expert insights on potential returns and risks. Assistance in building a diversified property portfolio.",
    },
    {
      id: "loan2",
      title: "Loan & Financing Solutions",
      text: "Expert advice on loan options and terms. Assistance in approval procedures & tailored financing.",
    },
    {
      id: "real",
      title: "Real Estate Consultation",
      text: "Personalized advice tailored to individual client needs. Market analysis to identify trends & opportunities.",
    },
    {
      id: "discovery",
      title: "Property Discovery & Tours",
      text: "Customized property searches based on client preferences and arranged viewings at convenient times.",
    },
    {
      id: "after2",
      title: "After Sales Support",
      text: "Start-to-end assistance for closing legal documentation and post-sale check-ins to address concerns.",
    },
  ];

  // 🛡️ safety
  if (bigServices.length < 3) return null;

  return (
    <section className="py-6 relative bg-white overflow-visible">
      <div className="max-w-[1180px] mx-auto px-4 overflow-visible">

        {/* TOP 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bigServices.slice(0, 2).map((b) => (
            <div
              key={b.id}
              className="border border-gray-300 rounded-xl p-10 bg-white min-h-[220px] flex flex-col justify-center"
            >
              <h4 className="text-[#F5A300] text-xl font-semibold mb-3">
                {b.title}
              </h4>
              <p className="text-gray-600 text-[15px] leading-6 max-w-[420px]">
                {b.text}
              </p>
            </div>
          ))}
        </div>

        {/* CENTER HIGHLIGHT */}
        <div className="relative flex justify-center -mt-[60px] -mb-[60px] z-20 overflow-visible">
          <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-10 text-center w-full max-w-[520px] min-h-[220px]">
            <h4 className="text-[#F5A300] text-xl font-semibold mb-3">
              {bigServices[2].title}
            </h4>
            <p className="text-gray-600 text-[15px] leading-6">
              {bigServices[2].text}
            </p>
          </div>
        </div>

        {/* BOTTOM 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {bigServices.slice(3).map((b) => (
            <div
              key={b.id}
              className="border border-gray-300 rounded-xl p-10 bg-white min-h-[220px] flex flex-col justify-center"
            >
              <h4 className="text-[#F5A300] text-xl font-semibold mb-3">
                {b.title}
              </h4>
              <p className="text-gray-600 text-[15px] leading-6 max-w-[420px]">
                {b.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

