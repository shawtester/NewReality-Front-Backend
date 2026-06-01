import Navbar from "../components/Header";
import Footer from "../components/Footer";
import { getSEO } from "@/lib/firestore/seo/read";


/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "terms-and-conditions"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title =
      seo?.title || "Terms and Conditions — Neev Realty";

    const description =
      seo?.description ||
      "Read the Terms and Conditions of Neev Realty governing the use of our website and real estate services.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/terms-and-conditions";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
        "terms and conditions neev realty",
        "real estate website terms india",
        "property platform legal terms",
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
  } catch (error) {
    return {
      title: "Terms and Conditions — Neev Realty",
      description:
        "Terms and Conditions of Neev Realty.",
    };
  }
}

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />

      <section className="py-8 px-4 sm:px-6 lg:px-0">
        <div className="max-w-[1173px] mx-auto text-gray-900">

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-6">
            Terms And Condition
          </h1>

          {/* Intro */}
          <p className="mb-6 leading-relaxed">
            Welcome to Neev Realty! By accessing or using our website
            ("www.neevrealty.com") you agree to comply with and be bound by these
            Terms and Conditions (“Terms”). Please read them carefully before
            using the Site. If you do not agree with these Terms, please refrain
            from using the Site.
          </p>

          {/* 1 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              1. Introduction
            </h2>
            <p>
              Neev Realty operates this Site to provide information about our
              real estate services and properties in India. These Terms govern
              your use of the Site, including all content, features, and
              services provided.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              2. Eligibility
            </h2>
            <p>By using the Site, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">You are at least 18 years of age.</li>
              <li className="font-semibold">You have the legal authority to enter into these Terms.</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              3. Use of the Site
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">
                Use the Site only for lawful purposes and in accordance with
                these Terms.
              </li>
              <li className="font-semibold">
                Refrain from using the Site in any manner that could damage,
                disable, or impair our services.
              </li>
              <li className="font-semibold">
                Not engage in unauthorized access, copying, or distribution of
                content from the Site.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              4. Intellectual Property
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">
                All content on this Site, including text, graphics, logos,
                images, and software, is the intellectual property of Neev
                Realty or its licensors.
              </li>
              <li className="font-semibold">
                You may not copy, modify, distribute, or reproduce any content
                without prior written consent from Neev Realty.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              5. Property Listings
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">
                Property listings on our Site are for informational purposes
                only and are subject to change without notice.
              </li>
              <li className="font-semibold">
                While we strive to provide accurate and up-to-date information,
                we do not guarantee the completeness, accuracy, or availability
                of listings.
              </li>
              <li className="font-semibold">
                All transactions and agreements related to properties are
                governed by applicable laws and specific terms of the
                agreements.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              6. User-Submitted Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">
                If you submit any information through the Site, including
                inquiries or feedback, you grant Neev Realty a non-exclusive,
                royalty-free license to use, modify, and display the content
                for business purposes.
              </li>
              <li className="font-semibold">
                You are responsible for ensuring the accuracy and legality of
                the information you provide.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              7. Privacy
            </h2>
            <p>
              Your use of the Site is also governed by our Privacy Policy,
              which outlines how we collect, use, and protect your personal
              information.
            </p>
          </section>

          {/* 8 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              8. Disclaimer of Warranties
            </h2>
            <p>
              The Site and its content are provided on an “as-is” and
              “as-available” basis. Neev Realty makes no representations or
              warranties of any kind, express or implied, regarding the Site,
              including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">The accuracy or reliability of content.</li>
              <li className="font-semibold">The uninterrupted or error-free operation of the Site.</li>
            </ul>
          </section>

          {/* 9 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              9. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Neev Realty shall not be
              liable for any direct, indirect, incidental, consequential, or
              punitive damages arising out of your use of the Site or reliance
              on its content
            </p>
          </section>

          {/* 10 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              10. Third-Party Links
            </h2>
            <p>
              The Site may contain links to third-party websites for your
              convenience. Neev Realty is not responsible for the content,
              policies, or practices of these external sites. Access them at
              your own risk.
            </p>
          </section>

          {/* 11 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              11. Modifications to the Terms
            </h2>
            <p>
              Neev Realty reserves the right to modify or update these Terms at
              any time without prior notice. Changes will be posted on this
              page with the “Effective Date” updated. Your continued use of the
              Site constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 12 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              12. Governing Law and Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of India. Any disputes
              arising from your use of the Site will be subject to the
              exclusive jurisdiction of the courts in Gurugram, Haryana.
            </p>
          </section>

          {/* 13 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              13 Termination
            </h2>
            <p>
              Neev Realty reserves the right to suspend or terminate your
              access to the Site at its discretion, without notice, for any
              violation of these Terms or for other reasons deemed
              appropriate.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              14. Contact Us
            </h2>
            <p className="mb-2">
              Neev Realty reserves the right to modify or update these Terms at
              any time without prior notice. Changes will be posted on this
              page with the “Effective Date” updated. Your continued use of the
              Site constitutes acceptance of the revised Terms.
            </p>

            <p>For any questions, concerns, or feedback regarding these Terms, please contact us:</p>

            <p className="font-semibold">Neev Realty</p>
            <p>Email: Info@neevrealty.com</p>
            <p>Phone: +91 8824-966-966</p>
            <p>
              Address: SF 09, Ninex City Mart, Sector 49, Gurgaon, Haryana,
              122018
            </p>

            <p className="mt-2">
              By using our services, you agree to the terms outlined in this
              Privacy Policy. We are committed to ensuring your privacy and
              building trust as your preferred real estate advisory in India.
            </p>
          </section>

        </div>
      </section>

      <Footer />
    </>
  );
}

