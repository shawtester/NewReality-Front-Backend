'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK (server-side)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function submitContactForm(prevState, formData) {
  const name = formData.get('name')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim().replace(/\D/g, '');
  const email = formData.get('email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();
  const propertyTitle = formData.get('propertyTitle')?.toString().trim();

  // Validation
  if (!name || !phone || !email || !propertyTitle) {
    return { success: false, message: 'Please fill all required fields.' };
  }

  if (phone.length !== 10) {
    return { success: false, message: 'Please enter valid 10-digit phone number.' };
  }

  try {
    // ✅ SAVES TO YOUR FIRESTORE 'contacts' collection
    await db.collection('contacts').add({
      name,
      phone: `91${phone}`, // India format
      email: email.toLowerCase(),
      message: message || '',
      propertyTitle,
      status: 'new', // new, contacted, closed
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Contact saved: ${name} - ${propertyTitle}`);

    return { 
      success: true, 
      message: `Thank you ${name}! Inquiry saved. We'll call soon.` 
    };

  } catch (error) {
    console.error('❌ Save error:', error);
    return { success: false, message: 'Save failed. Please try again.' };
  }
}
