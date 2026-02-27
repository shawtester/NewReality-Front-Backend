import Navbar from "../components/Header";
import Footer from "../components/Footer";
import { getSEO } from "@/lib/firestore/seo/read"; // ✅ SAME AS COMMERCIAL

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const slug = "faqs"; // Must match Firestore document ID

  const seo = await getSEO(slug);

  const title =
    seo?.title ||
    "Frequently Asked Questions — Neev Realty";

  const description =
    seo?.description ||
    "Find answers to common questions about buying, selling, renting properties and real estate services with Neev Realty.";

  const canonicalURL =
    seo?.canonical ||
    "https://www.neevrealty.com/faq";

  const keywords = Array.isArray(seo?.keywords)
    ? seo.keywords
    : seo?.keywords?.split(",").map((k) => k.trim()) || [
        "real estate FAQ india",
        "buy property gurgaon faq",
        "property investment questions",
        "neev realty help",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalURL,
    },
    openGraph: {
      title,
      description,
      url: canonicalURL,
      siteName: "Neev Realty",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <section className="py-10 px-4 sm:px-6 lg:px-0">
        <div className="max-w-[1173px] mx-auto text-gray-900">

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h1>

          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Find clear and professional answers to common real estate questions
            about buying, selling, renting, and investing in properties with Neev Realty.
          </p>

          {/* FAQ List */}
          <div className="space-y-6">

            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg lg:text-xl font-semibold mb-2">
                  {index + 1}. {faq.question}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ===========================
   ✅ PROFESSIONAL REAL ESTATE FAQ DATA
=========================== */

const faqData = [
  {
    question: "What services does Neev Realty provide?",
    answer:
      "Neev Realty offers comprehensive real estate services including property buying, selling, leasing, investment advisory, and market consultation across India.",
  },
  {
    question: "How can I schedule a property visit?",
    answer:
      "You can schedule a visit by contacting us through our website, phone number, or by submitting an inquiry form. Our team will coordinate a convenient time for you.",
  },
  {
    question: "Are property prices negotiable?",
    answer:
      "In many cases, property prices are negotiable depending on market conditions, seller expectations, and buyer demand. Our advisors assist in fair negotiations.",
  },
  {
    question: "What documents are required to buy a property?",
    answer:
      "Common documents include ID proof, address proof, PAN card, income proof, bank statements, and property-related documents such as title deed and sale agreement.",
  },
  {
    question: "Do you assist with home loans?",
    answer:
      "Yes, we guide clients through the home loan process and connect them with trusted banking partners to secure competitive interest rates.",
  },
  {
    question: "What is RERA and why is it important?",
    answer:
      "RERA (Real Estate Regulatory Authority) ensures transparency and protects buyers by regulating builders and developers in India.",
  },
  {
    question: "How do I verify property ownership?",
    answer:
      "Ownership can be verified through the title deed, encumbrance certificate, and local authority records. We assist clients in conducting due diligence.",
  },
  {
    question: "What are the additional costs involved in buying property?",
    answer:
      "Additional costs may include stamp duty, registration fees, GST (if applicable), legal fees, and brokerage charges.",
  },
  {
    question: "Can NRIs invest in Indian real estate?",
    answer:
      "Yes, NRIs can invest in residential and commercial properties in India subject to RBI and FEMA guidelines.",
  },
  {
    question: "What is the difference between carpet area and super built-up area?",
    answer:
      "Carpet area refers to the actual usable area within the walls, while super built-up area includes common areas such as corridors and amenities.",
  },
  {
    question: "How long does the property buying process take?",
    answer:
      "The timeline varies but typically ranges between 30–90 days depending on documentation, financing, and legal clearance.",
  },
  {
    question: "Is it safe to buy under-construction properties?",
    answer:
      "It can be safe if the developer is reputable and the project is RERA-approved. Proper legal checks are essential.",
  },
  {
    question: "What is a sale agreement?",
    answer:
      "A sale agreement outlines the terms and conditions agreed upon between buyer and seller before the final sale deed is executed.",
  },
  {
    question: "Do you provide rental property management?",
    answer:
      "Yes, we assist landlords with tenant screening, lease agreements, and ongoing property management support.",
  },
  {
    question: "What is stamp duty?",
    answer:
      "Stamp duty is a government tax paid on property transactions during registration of the sale deed.",
  },
  {
    question: "How do I know if a property has legal clearances?",
    answer:
      "Legal clearances include approved building plans, RERA registration, land-use permissions, and occupancy certificate verification.",
  },
  {
    question: "What is an occupancy certificate?",
    answer:
      "An occupancy certificate confirms that the property complies with building regulations and is safe for occupation.",
  },
  {
    question: "What factors affect property prices?",
    answer:
      "Location, infrastructure development, demand-supply ratio, amenities, and economic conditions significantly influence property prices.",
  },
  {
    question: "Can I sell my property through Neev Realty?",
    answer:
      "Yes, we assist property owners in marketing, valuation, negotiations, and closing the transaction professionally.",
  },
  {
    question: "Do you charge brokerage fees?",
    answer:
      "Yes, brokerage fees are applicable and vary depending on the transaction type. Our team provides transparent fee structures.",
  },
  {
    question: "What is a possession letter?",
    answer:
      "A possession letter is issued by the developer stating the date on which the buyer can take possession of the property.",
  },
  {
    question: "How can I invest in commercial real estate?",
    answer:
      "Commercial real estate investment involves purchasing office spaces, retail shops, or industrial units for rental income or capital appreciation.",
  },
  {
    question: "Is real estate a good long-term investment?",
    answer:
      "Real estate is generally considered a stable long-term investment offering potential capital appreciation and rental income.",
  },
  {
    question: "What happens if a deal falls through?",
    answer:
      "If a deal falls through, refund terms depend on the agreement conditions. Our team works to minimize such risks through proper documentation.",
  },
  {
    question: "How do I get started with Neev Realty?",
    answer:
      "Simply contact our team via phone or website inquiry form. Our advisors will understand your requirements and guide you accordingly.",
  },
];