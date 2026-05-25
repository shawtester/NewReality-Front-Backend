import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth, db } from "@/lib/firebase_admin";

const MANAGER_EMAILS = [
  "vivek.malik@neevrealty.com",
  "shubhamsamchaudhary143@gmail.com",
];
const SETTINGS_COLLECTION = "adminSettings";
const SETTINGS_DOC = "sensitiveAccess";
const HASH_ITERATIONS = 120000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

function getFallbackKey() {
  return process.env.ADMIN_DATA_ACCESS_KEY || "Neev@2026";
}

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");
}

function timingSafeStringEqual(left, right) {
  const leftBuffer = Buffer.from(left || "");
  const rightBuffer = Buffer.from(right || "");

  if (leftBuffer.length !== rightBuffer.length) return false;

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function getPasswordConfig() {
  const snapshot = await db
    .collection(SETTINGS_COLLECTION)
    .doc(SETTINGS_DOC)
    .get();

  if (snapshot.exists) {
    const data = snapshot.data() || {};

    if (data.passwordHash && data.salt) {
      return {
        passwordHash: data.passwordHash,
        salt: data.salt,
      };
    }
  }

  const salt = "default-admin-sensitive-access";

  return {
    passwordHash: hashPassword(getFallbackKey(), salt),
    salt,
  };
}

async function verifyPassword(password) {
  const { passwordHash, salt } = await getPasswordConfig();
  const receivedHash = hashPassword(password || "", salt);

  return timingSafeStringEqual(receivedHash, passwordHash);
}

async function verifyManager(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) return null;

  try {
    const decoded = await auth.verifyIdToken(token);
    const email = decoded?.email?.toLowerCase();

    return MANAGER_EMAILS.includes(email) ? email : null;
  } catch (error) {
    return null;
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const key = typeof body?.key === "string" ? body.key : "";

  if (!(await verifyPassword(key))) {
    return NextResponse.json(
      { unlocked: false, message: "Invalid access key" },
      { status: 401 }
    );
  }

  return NextResponse.json({ unlocked: true });
}

export async function PATCH(request) {
  const managerEmail = await verifyManager(request);

  if (!managerEmail) {
    return NextResponse.json(
      { updated: false, message: "Only Vivek can change this password" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const newKey = typeof body?.newKey === "string" ? body.newKey.trim() : "";

  if (newKey.length < 6) {
    return NextResponse.json(
      { updated: false, message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newKey, salt);

  await db.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC).set(
    {
      passwordHash,
      salt,
      updatedBy: managerEmail,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return NextResponse.json({ updated: true });
}
