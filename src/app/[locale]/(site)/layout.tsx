/** Pages live in this group so that not-found.tsx renders inside the [locale] root layout */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
