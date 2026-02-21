import Navbar from "../components/Header";
import Footer from "../components/Footer";
import { getSEO } from "@/lib/firestore/seo/read";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "privacy-policy"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title =
      seo?.title || "Privacy Policy — Neev Realty";

    const description =
      seo?.description ||
      "Read the Privacy Policy of Neev Realty and learn how we collect, use, and protect your personal information.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/privacy-policy";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
        "privacy policy neev realty",
        "real estate privacy india",
        "property data protection",
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
      title: "Privacy Policy — Neev Realty",
      description: "Privacy Policy of Neev Realty.",
    };
  }
}

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <section className="py-8 px-4 sm:px-6 lg:px-0">
        <div className="max-w-[1173px] mx-auto text-gray-900">

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-6">
            Privacy Policy
          </h1>

          {/* Intro */}
          <p className="mb-6 leading-relaxed">
            At Neev Realty your privacy is of utmost importance to us. This
            Privacy Policy explains how we collect, use, disclose, and protect
            your personal information when you use our services or interact
            with us through our website or other communication channels in
            India.
          </p>

          {/* 1 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              1. information we collect
            </h2>
            <p className="mb-2">
              We may collect the following types of personal information:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-bold">Personal Details:</span> Name, email address, phone number, and address.
              </li>
              <li>
                <span className="font-bold">Property Preferences:</span> Information about your preferred property type, location, and budget.
              </li>
              <li>
                <span className="font-bold">Transaction Details:</span> Data related to property transactions, agreements, and payment details.
              </li>
              <li>
                <span className="font-bold">Website Usage Data:</span> Information such as IP address, device type, browser type, and pages visited.
              </li>
              <li>
                <span className="font-bold">Other Information:</span> Any additional details you provide, such as feedback, inquiries, or service requests.
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              2. How We Use Your Information
            </h2>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-bold">Your personal information is used to:</span>
              </li>
              <li>Understand your real estate requirements and provide tailored property recommendations.</li>
              <li>Facilitate property-related services, including negotiations and transactions.</li>
              <li>Communicate updates, offers, and promotional materials (only with your consent).</li>
              <li>Improve our website and services through user feedback and analytics.</li>
              <li>Comply with applicable laws and regulations.</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              3. Sharing Your Information
            </h2>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-bold">Developers and Builders:</span> To assist with property viewings and transactions.
              </li>
              <li>
                <span className="font-bold">Service Providers:</span> Trusted third parties that provide operational, marketing, and technical support.
              </li>
              <li>
                <span className="font-bold">Legal Authorities:</span> When required by law or to protect our legal rights.
              </li>
              <li>
                <span className="font-bold">Other Parties:</span> With your explicit consent for specific purposes.
              </li>
              <li>We do not sell or rent your personal information to third parties.</li>
            </ul>
          </section>

          {/* 4 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              4. Data Retention
            </h2>
            <p>
              We retain your information only as long as necessary to fulfill
              the purposes outlined in this policy or as required by law.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              5. Security Measures
            </h2>
            <p>
              Neev Realty uses appropriate technical and organizational measures
              to protect your personal information against unauthorized access,
              alteration, or disclosure. While we strive to safeguard your
              data, no system is entirely secure, and we cannot guarantee
              complete protection.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              6. Your Rights
            </h2>

            <ul className="list-disc pl-6 space-y-1">
              <li>Access and review your personal information.</li>
              <li>Update or correct inaccuracies in your data.</li>
              <li>Request the deletion of your personal information, subject to legal obligations.</li>
              <li>Opt-out of receiving marketing communications.</li>
            </ul>

            <p className="mt-2">
              To exercise your rights, contact us at Info@neevrealty.in
            </p>
          </section>

          {/* 7 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              7. Use of Cookies
            </h2>
            <p>
              Our website uses cookies to enhance user experience and gather
              insights into website usage. You can manage your cookie
              preferences through your browser settings.
            </p>
          </section>

          {/* 8 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to external websites. We are not
              responsible for the privacy practices or content of these
              websites. Please review their privacy policies independently.
            </p>
          </section>

          {/* 9 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              9. Compliance with Indian Laws
            </h2>
            <p>
              This Privacy Policy is compliant with applicable Indian laws,
              including the Information Technology Act, 2000 and associated
              rules, as well as the guidelines of the Personal Data Protection
              Bill, 2019, where applicable.
            </p>
          </section>

          {/* 10 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              10. Updates to This Policy
            </h2>
            <p>
              We reserve the right to update this Privacy Policy from time to
              time. Any changes will be posted on this page, and the "Effective
              Date" will be updated. We encourage you to review this policy
              periodically to stay informed.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              11. Contact Us
            </h2>
            <p className="mb-2">
              If you have any questions or concerns about this Privacy Policy
              or our data handling practices, please contact us at:
            </p>
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
