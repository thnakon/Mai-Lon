export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Landing page doesn't need the app sidebar
  return <>{children}</>;
}
