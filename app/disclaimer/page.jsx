import Navbar from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <section className="py-8 px-4 sm:px-6 lg:px-0">
        <div className="max-w-[1173px] mx-auto text-gray-900">

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-6">
            Disclaimer
          </h1>

          {/* Intro Paragraph */}
          <p className="mb-6 leading-relaxed">
            The information provided on the Neev Realty website
            ("www.neevrealty.com") is for general informational purposes only.
            While we strive to ensure the accuracy and reliability of the
            content, we make no guarantees or warranties of any kind, express or
            implied, regarding the completeness, accuracy, or availability of
            the information provided.
          </p>

          {/* Section 1 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              1. No Real Estate Advice
            </h2>
            <p className="leading-relaxed">
              The content on this Site, including property listings,
              descriptions, and related materials, is provided for
              informational purposes only and should not be considered
              professional real estate advice. For specific advice tailored
              to your needs, please consult with qualified real estate
              professionals or legal advisors.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              2. Accuracy of Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">
                Property details, availability, prices, and other related
                information are subject to change without prior notice.
              </li>
              <li className="font-semibold">
                While we endeavor to keep the information up to date,
                inaccuracies or typographical errors may occur. Neev Realty
                disclaims liability for any such errors or omissions.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              3. No Guarantee of Availability
            </h2>
            <p className="leading-relaxed">
              The properties listed on the Site are subject to availability
              and may no longer be available for sale, lease, or rent at the
              time of your inquiry. Neev Realty is not responsible for any
              loss or inconvenience caused by reliance on the information
              provided.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              4. Third-Party Links
            </h2>
            <p className="leading-relaxed">
              This Site may contain links to external websites for your
              convenience. Neev Realty does not endorse or assume
              responsibility for the content, accuracy, or practices of
              these third-party sites. Access them at your own discretion
              and risk.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              5. No Warranty
            </h2>
            <p className="leading-relaxed mb-2">
              The Site is provided on an “as-is” and “as-available” basis
              without warranties of any kind, express or implied, including
              but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">
                Warranties of merchantability or fitness for a particular purpose.
              </li>
              <li className="font-semibold">
                Warranties regarding the uninterrupted or error-free operation of the Site.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed mb-2">
              Neev Realty shall not be held liable for any direct, indirect,
              incidental, consequential, or special damages arising from or
              related to your use of the Site, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="font-semibold">Loss of data or profits.</li>
              <li className="font-semibold">Inaccurate property details.</li>
              <li className="font-semibold">Delays or interruptions in service.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              7. No Partnership or Agency
            </h2>
            <p className="leading-relaxed">
              Use of this Site does not establish any partnership, joint
              venture, or agency relationship between you and Neev Realty.
              All property-related transactions and decisions should be
              made independently.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              8. Legal Compliance
            </h2>
            <p className="leading-relaxed">
              The content on the Site is intended for use in accordance with
              Indian laws and regulations. Neev Realty disclaims any
              liability for non-compliance with local laws outside India.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              9. Changes to the Disclaimer
            </h2>
            <p className="leading-relaxed">
              Neev Realty reserves the right to modify this Disclaimer at
              any time without prior notice. Updates will be posted on this
              page with the “Effective Date” revised accordingly.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              10. Contact Us
            </h2>
            <p className="leading-relaxed mb-2">
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
            <p className="mt-2 leading-relaxed">
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
