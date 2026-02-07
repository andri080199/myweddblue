export default function ClientLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own full-screen layout without sidebar
  return <>{children}</>;
}
