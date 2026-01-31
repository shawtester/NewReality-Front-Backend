"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

console.log("🔥 Firebase db object:", db);

const benefitsLeft = [
  "Health Benefits",
  "Employee Recognition Platform",
  "Professional Development",
  "Access to Industry Events",
];

const benefitsRight = [
  "100% Company Paid Life Insurance",
  "Work-Life Balance",
  "Diversity & Inclusion Initiatives",
];

const WhatWeOffer = () => {
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    position: "",
    experience: "",
    resumeFile: null,
    description: "",
  });

  const CLOUDINARY_CLOUD_NAME = "dzcocqhut";
  const CLOUDINARY_UPLOAD_PRESET = "resume_upload";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, resumeFile: e.target.files[0] }));
  };

  const uploadToCloudinary = async (file) => {
    if (!file) throw new Error("No file");
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formDataToSend.append("folder", "resumes");
    formDataToSend.append("resource_type", "auto");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formDataToSend }
    );

    if (!response.ok) throw new Error("Cloudinary failed");
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🔥 FORM SUBMIT STARTED");
    console.log("📋 Form data:", formData);
    console.log("🔥 Firebase db:", db);

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.position || !formData.resumeFile) {
      setSubmitStatus("Please fill all required fields*");
      return;
    }

    setLoading(true);
    setSubmitStatus("");

    try {
      // 1. Cloudinary
      console.log("📤 1. Cloudinary...");
      const resumeURL = await uploadToCloudinary(formData.resumeFile);
      console.log("✅ 1. Cloudinary URL:", resumeURL);

      // 2. 🔥 FIXED FIREBASE DATA - ALL FIELDS ADMIN NEEDS
      const firebaseData = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        position: formData.position,
        experience: formData.experience || "",
        description: formData.description || "",
        resumeURL,
        source: "careers-page",
        status: "pending",
        submittedAt: serverTimestamp(),  // ✅ CRITICAL: Admin query needs this!
      };
      console.log("📝 2. Firebase data:", firebaseData);

      // 3. Collection access
      console.log("🔍 3. Testing collection...");
      const contactsCollection = collection(db, "send_resume");
      console.log("✅ 3. Collection object:", contactsCollection);

      // 4. Save to Firebase
      console.log("💾 4. Saving document...");
      const docRef = await addDoc(contactsCollection, firebaseData);
      console.log("🎉 5. ✅ FIREBASE SUCCESS! Document ID:", docRef.id);

      setSubmitStatus("✅ Resume submitted successfully!");
      setShowResumePopup(false);
      setFormData({
        fullName: "", 
        email: "", 
        mobile: "", 
        position: "", 
        experience: "", 
        resumeFile: null, 
        description: ""
      });

    } catch (error) {
      console.error("💥 6. ❌ COMPLETE ERROR:", error);
      console.error("Code:", error.code);
      console.error("Message:", error.message);
      setSubmitStatus(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full bg-[#F6FAFF] py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-4">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            What we <span className="text-[#DBA40D]">Offer</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[benefitsLeft, benefitsRight].map((group, i) => (
              <div key={i} className="space-y-4">
                {group.map((item) => (
                  <div key={item} className="rounded-md border border-[#E4EDF8] bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 px-4">
          <div className="mx-auto max-w-6xl rounded-3xl bg-slate-50 px-6 py-10 md:px-10 lg:px-16">
            <div className="max-w-xl space-y-6">
              <h3 className="text-3xl font-semibold md:text-4xl">
                Join Our <span className="text-[#DBA40D]">Team</span>
              </h3>
              <p className="text-sm text-slate-600">At Neev Realty, your ideas matter and your career grows with us.</p>
              <button
                onClick={() => setShowResumePopup(true)}
                className="rounded-lg bg-[#DBA40D] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(219,164,13,0.45)] hover:brightness-110"
              >
                Send your Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {showResumePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 md:p-4">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-3 md:p-4 lg:p-8 shadow-2xl max-h-[90dvh] overflow-y-auto">
            <button
              onClick={() => setShowResumePopup(false)}
              className="absolute right-2 top-2 md:right-4 md:top-4 text-xl text-gray-400 hover:text-black"
              aria-label="Close form"
            >
              ✕
            </button>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2">Submit Your Resume</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">Please fill in your details below and upload your resume.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                <input 
                  name="fullName" 
                  type="text" 
                  placeholder="Full Name*" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  required 
                  className="border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none" 
                />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email Address*" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  className="border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none" 
                />
                <input 
                  name="mobile" 
                  type="tel" 
                  placeholder="Mobile Number*" 
                  value={formData.mobile} 
                  onChange={handleInputChange} 
                  required 
                  className="border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none" 
                />
                
                <select 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange} 
                  required 
                  className="border rounded-md px-3 md:px-4 py-2.5 text-sm text-gray-600 focus:border-[#DBA40D] outline-none"
                >
                  <option value="">Applying For Position*</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Channel Partner">Channel Partner</option>
                  <option value="Operations">Operations</option>
                </select>
                
                <select 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleInputChange} 
                  className="border rounded-md px-3 md:px-4 py-2.5 text-sm text-gray-600 focus:border-[#DBA40D] outline-none"
                >
                  <option value="">Total Work Experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1–2 Years">1–2 Years</option>
                  <option value="3–5 Years">3–5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
                
                <div className="md:col-span-2">
                  <input 
                    type="file" 
                    name="resumeFile" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange} 
                    required
                    className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#DBA40D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#c8950a]" 
                  />
                  {formData.resumeFile && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.resumeFile.name}{" "}
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {((formData.resumeFile.size / 1024 / 1024) || 0).toFixed(2)} MB
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <textarea 
                name="description" 
                rows={2} 
                placeholder="Briefly describe your experience (optional)" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="w-full border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none" 
              />

              {submitStatus && (
                <div className={`text-sm p-2 rounded-md text-center ${
                  submitStatus.includes("✅") || submitStatus.includes("success")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {submitStatus}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full rounded-lg py-2.5 md:py-3 text-sm font-semibold text-white transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#DBA40D] hover:bg-[#c8950a]"}`}
              >
                {loading ? "Submitting..." : "Submit Resume"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatWeOffer;
