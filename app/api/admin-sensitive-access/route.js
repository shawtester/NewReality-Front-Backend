import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "admin_sensitive_access";
const EIGHT_HOURS = 60 * 60 * 8;

function getAccessKey() {
  return process.env.ADMIN_DATA_ACCESS_KEY || "Neev@2026";
}

function getSecret() {
  return process.env.ADMIN_DATA_LOCK_SECRET || getAccessKey();
}

function signToken(expiresAt) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(String(expiresAt))
    .digest("hex");
}

function createToken() {
  const expiresAt = Date.now() + EIGHT_HOURS * 1000;
  const signature = signToken(expiresAt);
  return `${expiresAt}.${signature}`;
}

function isValidToken(token) {
  if (!token || !token.includes(".")) return false;

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = signToken(expiresAt);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature || "");

  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

function isCorrectKey(key) {
  const expected = Buffer.from(getAccessKey());
  const received = Buffer.from(key || "");

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  return NextResponse.json({
    unlocked: isValidToken(token),
  });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const key = typeof body?.key === "string" ? body.key : "";

  if (!isCorrectKey(key)) {
    return NextResponse.json(
      { unlocked: false, message: "Invalid access key" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ unlocked: true });

  response.cookies.set({
    name: COOKIE_NAME,
    value: createToken(),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: EIGHT_HOURS,
    path: "/",
  });

  return response;
}
