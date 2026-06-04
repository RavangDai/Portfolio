import { ContactSection } from "@/components/ui/contact-section";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata = {
  title: "Contact · Bibek Pathak",
  description: "Get in touch — open to internships and engineering roles, remote or onsite.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactSection />
    </PageTransition>
  );
}
