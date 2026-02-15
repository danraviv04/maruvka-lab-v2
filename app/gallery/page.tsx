'use client';

import { useState } from 'react';
import Image from 'next/image';
import Container from '../../components/Container';
import SectionHeader from '../../components/SectionHeader';
import { galleryItems, categories } from '../../content/gallery';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-background">
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Visuals"
            title="Gallery"
            description="Research figures, lab photos, and moments from our scientific community."
          />

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-800 text-muted hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-text/70 line-clamp-2">{item.description}</p>
                  )}
                  {item.date && (
                    <p className="mt-2 text-xs text-muted/80">{item.date}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-text/70">No images in this category yet.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-2xl text-primary shadow-lg transition hover:bg-white dark:hover:bg-slate-800 hover:scale-110"
              aria-label="Close"
            >
              ×
            </button>

            {/* Image */}
            <div className="relative aspect-[16/10] bg-black/5">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Caption */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="mt-2 text-sm text-muted">{selectedImage.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-muted/80">
                {selectedImage.date && <span>{selectedImage.date}</span>}
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                  {categories.find(c => c.value === selectedImage.category)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
