import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { submitLeadToCRM } from "@/app/actions/crmActions";

/**
 * Centrally saves lead to Firebase Firestore and submits to BUILDESK-CRM.
 * Retains original operations so existing dashboards function exactly as before.
 */
export async function saveLead({
  name = "",
  email = "",
  phone = "",
  countryCode = "+91",
  propertyTitle = "",
  source = "",
  message = "",
  loanAmount = null,
  interestRate = null,
  tenure = null,
  collectionName = "contacts", // defaults to 'contacts', can be set to 'brochureLeads'
  extraData = {}
}) {
  try {
    // 1. Safe capture of UTM parameters from browser sessionStorage
    let utmData = {};
    if (typeof window !== "undefined") {
      try {
        const stored = window.sessionStorage.getItem("neev_utm");
        if (stored) {
          utmData = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Error reading UTM from sessionStorage:", e);
      }
    }

    // 2. Format phone with country code for Firebase storage
    const formattedPhoneForDb = phone.trim().startsWith("+") 
      ? phone.trim() 
      : `${countryCode}${phone.trim()}`;

    // 3. Construct payload for Firestore
    const firestorePayload = {
      name: name.trim(),
      phone: formattedPhoneForDb,
      email: email.trim().toLowerCase(),
      message: message ? message.trim() : "",
      propertyTitle: propertyTitle || "General Inquiry",
      source: source || "website",
      status: "new",
      createdAt: serverTimestamp(),
      ...extraData
    };

    // Add EMI specific fields if present
    if (loanAmount !== null) firestorePayload.loanAmount = loanAmount;
    if (interestRate !== null) firestorePayload.interestRate = interestRate;
    if (tenure !== null) firestorePayload.tenure = tenure;

    // 4. Save to Firestore
    const docRef = await addDoc(collection(db, collectionName), firestorePayload);
    console.log(`[Firestore] Document saved in "${collectionName}":`, docRef.id);

    // 5. Submit to BUILDESK-CRM Server Action (non-blocking, don't let CRM failure block client UX)
    try {
      const crmResult = await submitLeadToCRM({
        name,
        email,
        phone,
        countryCode,
        propertyTitle,
        source,
        message,
        loanAmount,
        interestRate,
        tenure,
        utmData
      });
      console.log("[CRM] Submission completed:", crmResult);
      return { success: true, firestoreId: docRef.id, crm: crmResult };
    } catch (crmErr) {
      console.error("[CRM] Server action execution failed:", crmErr);
      return { success: true, firestoreId: docRef.id, crm: { success: false, error: crmErr.message } };
    }

  } catch (error) {
    console.error("❌ saveLead Error:", error);
    throw error; // Re-throw to let component handle visual error state if needed
  }
}
