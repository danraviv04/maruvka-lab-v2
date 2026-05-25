import type { Metadata } from 'next';
import LabToolsNav from './LabToolsNav';
import QueryProvider from './QueryProvider';
import LabToolsGate from './LabToolsGate';

export const metadata: Metadata = {
  title: "Lab Tools | Maruvka Lab",
  description: "Internal lab management tools — schedule equipment, coordinate meetings, track procurement, and manage protocols.",
};

export default function LabToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <LabToolsGate>
        <div className="lab-tools-scope min-h-screen bg-background">
          <LabToolsNav />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </div>
      </LabToolsGate>
    </QueryProvider>
  );
}
