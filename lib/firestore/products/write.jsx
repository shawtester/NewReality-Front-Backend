import { db } from "@/lib/firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import slugify from "slugify";
import { defaultProperty } from "@/constants/propertyDefaults";

export const createNewProperty = async ({ data }) => {
  if (!data?.title) throw new Error("Project name is required");
  if (!data?.location) throw new Error("Location is required");

  const newId = doc(collection(db, "ids")).id;
  const sanitize = (obj) =>
  JSON.parse(JSON.stringify(obj));
  const slug =
    data.slug ||
    slugify(data.title, {
      lower: true,
      strict: true,
    });
  

  await setDoc(doc(db, "properties", newId), sanitize({
    ...defaultProperty,   // ✅ saare default fields
    ...data,              // ✅ form ke values override
    id: newId,
    slug,
    timestampCreate: Timestamp.now(),
    timestampUpdate: null,
  }));
};


/* =====================================================
   🔹 UPDATE PROPERTY
===================================================== */
export const updateProperty = async ({ data }) => {
  // ✅ ENSURE SLUG ALWAYS EXISTS
  const slug =
    data.slug ||
    slugify(data.title, {
      lower: true,
      strict: true,
    });

  await setDoc(
    doc(db, "properties", data.id),
    {
      ...data,
      slug, // ✅ KEEP SLUG IN SYNC
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

/* =====================================================
   🔹 DELETE PROPERTY
===================================================== */
export const deleteProperty = async ({ id }) => {
  await deleteDoc(doc(db, "properties", id));
};
