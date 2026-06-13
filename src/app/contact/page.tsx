import { ContactSection } from "@/components/ui/contact-section";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Bibek Pathak — open to internships and engineering roles, remote or onsite.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactSection />
    </PageTransition>
  );
}
