import { Sidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { NotificationProvider } from "@/components/providers/notification-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col pb-16 md:pb-0">
          <AppHeader />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
