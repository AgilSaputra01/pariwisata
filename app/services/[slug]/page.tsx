import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { POPULAR_SERVICES } from "@/lib/data/services";
import { POPULAR_ROUTES } from "@/lib/data/routes";
import { BLOG_POSTS } from "@/lib/data/blogs";
import ServicePageClient from "./ServicePageClient";
import { Users, Briefcase, ArrowLeft, Star, Shield, Clock, ChevronRight, Car, Ship, BookOpen } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return POPULAR_SERVICES.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = POPULAR_SERVICES.find((s) => s.id === params.slug);
  if (!service) return { title: "Layanan Tidak Ditemukan | BaliRide" };

  return {
    title: `${service.name} Bali | Rental Mobil & Supir Berlisensi | BaliRide`,
    description: `${service.description} Pesan ${service.name} di Bali dengan mudah via WhatsApp. Konfirmasi instan, supir berlisensi, armada prima & bersih.`,
    alternates: { canonical: `/services/${service.id}` },
    openGraph: {
      title: `${service.name} Bali | BaliRide`,
      description: service.description,
      images: [{ url: service.image, width: 1200, height: 630, alt: service.name }],
    },
  };
}

export default function ServicePage({ params }: Props) {
  const service = POPULAR_SERVICES.find((s) => s.id === params.slug);
  if (!service) notFound();

  const relatedServices = POPULAR_SERVICES.filter((s) => s.id !== service.id).slice(0, 3);
  const relatedRoutes = POPULAR_ROUTES.slice(0, 2);
  const relatedBlogs = BLOG_POSTS.filter(b => b.category === "car-rental" || b.category === "travel-tips").slice(0, 3);

  // JSON-LD Service schema without fixed price
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "TravelAgency",
      "name": "BaliRide Transport",
      "url": "https://baliride-trans.com",
    },
    "areaServed": {
      "@type": "Place",
      "name": "Bali, Indonesia",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Back Nav */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/#services"
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Layanan</span>
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Image + Details */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Image */}
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                {service.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-white/90 text-brand-700 shadow-sm backdrop-blur-xs">
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <span className="inline-block text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
                  {service.category.replace("_", " ")}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {service.name}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5 text-brand-500" /> {service.capacity}
                  </span>
                  {service.luggageCapacity && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Briefcase className="w-3.5 h-3.5 text-brand-500" /> {service.luggageCapacity}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">Deskripsi Layanan</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                {[
                  { icon: Shield, label: "Supir Berlisensi Resmi" },
                  { icon: Clock, label: "Tepat Waktu, Free Delay" },
                  { icon: Star, label: "Rating 4.9 / 1200+ Ulasan" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <Icon className="w-5 h-5 text-brand-600" />
                    <span className="text-[11px] font-semibold text-slate-700 leading-snug">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sticky Booking Order Form */}
            <div className="lg:col-span-2">
              <ServicePageClient service={service} />
            </div>
          </div>

          {/* Related Services & Fastboat Routes */}
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Layanan Lainnya yang Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/services/${rel.id}`}
                  className="group p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-card-hover bg-white transition-all"
                >
                  <div className="relative h-32 rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <Image src={rel.image} alt={rel.name} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-600 mb-1">
                    <Car className="w-3.5 h-3.5" />
                    <span>Armada Wisata</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{rel.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Kapasitas: {rel.capacity}</p>
                  <div className="flex items-center gap-1 text-xs text-brand-600 font-semibold mt-2">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}

              {relatedRoutes.slice(0, 1).map((rt) => (
                <Link
                  key={rt.id}
                  href={`/routes/${rt.id}`}
                  className="group p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-card-hover bg-white transition-all"
                >
                  <div className="relative h-32 rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <Image src={rt.image} alt={rt.destinationName} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-teal-600 mb-1">
                    <Ship className="w-3.5 h-3.5" />
                    <span>Tiket Fastboat</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{rt.departurePort.split("(")[0]} → {rt.destinationName}</h3>
                  <p className="text-xs text-slate-500 mt-1">{rt.schedules.length} Jadwal • {rt.durationMinutes} mnt</p>
                  <div className="flex items-center gap-1 text-xs text-teal-600 font-semibold mt-2">
                    <span>Lihat Rute</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Related Blogs Section */}
            {relatedBlogs.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  <h2 className="text-xl font-bold text-slate-900">Blog & Panduan Terkait</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((b) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
                      <div className="relative h-36 rounded-xl overflow-hidden mb-3.5 bg-slate-200">
                        <Image src={b.image} alt={b.title} fill sizes="300px" className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                        {b.readTime}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">{b.title}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">{b.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
