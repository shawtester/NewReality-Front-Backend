import { Timestamp } from "firebase/firestore";

export const defaultBlog = {
  /* 🔹 META */
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",

  /* 🔹 BASIC */
  title: "",
  slug: "",
  author: "",
  category: "",
  source: "",
  isActive: true,

  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",


  /* 🔹 MEDIA */
  image: null, // ✅ VERY IMPORTANT FIX

  /* 🔹 CONTENT */
  detailHeading: "",
  excerpt: "",
  shortDescription: "",
  content: "",
  toc: [],
  sections: [],
  faqs: [],

  /* 🔹 FLAGS */
  isFeatured: false,
  isTrending: false,

  /* 🔹 TIMESTAMP */
  timestampCreate: Timestamp.now(),
  timestampUpdate: null,
};
