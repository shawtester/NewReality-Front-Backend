"use client";

export default function CategorySelect({ category, setCategory }) {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="residential">Residential</option>
      <option value="apartment">Apartment</option>
      <option value="builder-floor">Builder Floor</option>
      <option value="commercial">Commercial</option>
      <option value="retail">Retail</option>
      <option value="sco">SCO</option>
    </select>
  );
}
