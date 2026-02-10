"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    label: "Residential",
    value: "residential",
    icon: "🏠",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Apartment",
    value: "apartment",
    icon: "🏢",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Builder Floor",
    value: "builder-floor",
    icon: "🏡",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Commercial",
    value: "commercial",
    icon: "🏛️",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
  },
  {
    label: "Retail",
    value: "retail",
    icon: "🛍️",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    label: "SCO",
    value: "sco",
    icon: "📈",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
];

export default function CategoryCards({ category, setCategory }) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Select Category
        </h2>
        <p className="text-sm text-gray-600">
          Choose a property category to manage banners
        </p>
      </div>

      {/* CATEGORY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {CATEGORIES.map((item) => {
          const isSelected = category === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`
                relative rounded-2xl p-6 text-center transition-all duration-300
                border-2 focus:outline-none
                ${
                  isSelected
                    ? `border-[#F5A300] ${item.bg} shadow-2xl scale-[1.03]`
                    : "border-gray-200 hover:border-[#F5A300] hover:shadow-lg"
                }
              `}
            >
              {/* ICON */}
              <div
                className={`
                  w-16 h-16 mx-auto mb-4 rounded-full
                  flex items-center justify-center text-3xl text-white
                  bg-gradient-to-br ${item.color}
                  ${isSelected ? "scale-110" : ""}
                `}
              >
                {item.icon}
              </div>

              {/* LABEL */}
              <h3
                className={`font-bold text-lg ${
                  isSelected ? "text-[#F5A300]" : "text-gray-900"
                }`}
              >
                {item.label}
              </h3>

              {/* HELPER TEXT */}
              <p className="text-xs text-gray-500 mt-1">
                {item.label} properties
              </p>

              {/* SELECTED BADGE */}
              {isSelected && (
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-[#F5A300] text-white">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SELECTED INFO */}
      {category && (
        <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-300">
          <p className="text-sm text-gray-700">
            Managing banners for{" "}
            <span className="font-semibold text-[#F5A300]">
              {CATEGORIES.find((c) => c.value === category)?.label}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
