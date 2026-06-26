import { redirect } from "next/navigation";

export default function BuilderOldRedirect({ params }) {
  redirect(`/builder/${params.slug}`);
}
