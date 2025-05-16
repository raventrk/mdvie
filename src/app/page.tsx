import { redirect } from "next/navigation";

export default function Home() {
  // Ana sayfadan template.md sayfasına yönlendir
  redirect("/edit/template.md");
}
