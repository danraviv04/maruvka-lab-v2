import type { Metadata } from 'next';
import Container from '@/components/Container';
import NewsAdminForm from '@/components/news-admin-form';
import SectionHeader from '@/components/SectionHeader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News Admin',
  description: 'Password-protected news editor for the Maruvka Lab website.',
};

export default function NewsAdminPage() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <SectionHeader eyebrow="Admin" title="Add Lab News" description="Create a new update for the website." />
        <NewsAdminForm />
      </Container>
    </section>
  );
}
