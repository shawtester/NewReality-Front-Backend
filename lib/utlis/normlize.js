export const normalizeFirestore = (data) => {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Firestore Timestamp
      if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
        return value.seconds; // OR toISOString()
      }
      return value;
    })
  );
};
