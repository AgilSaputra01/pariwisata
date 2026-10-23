import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { POPULAR_ROUTES } from "@/lib/data/routes";
import { POPULAR_SERVICES } from "@/lib/data/services";
import { BLOG_POSTS } from "@/lib/data/blogs";
import RoutePageClient from "./RoutePageClient";
import { Clock, ArrowLeft, Ship, Users, Anchor, ChevronRight, Car, BookOpen } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return POPULAR_ROUTES.map((r) => ({ slug: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = POPULAR_ROUTES.find((r) => r.id === params.slug);
  if (!route) return { title: "Rute Tidak Ditemukan | BaliRide" };

  const title = `Fastboat ${route.departurePort.split("(")[0].trim()} ke ${route.destinationName} | Jadwal & Pemesanan Online | BaliRide`;
  const desc = `Jadwal resmi fastboat dari ${route.departurePort.split("(")[0].trim()} ke ${route.destinationName}. Durasi ${route.durationMinutes} menit, ${route.schedules.length} jadwal per hari. Konfirmasi instan via WhatsApp.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `/routes/${route.id}` },
    openGraph: {
      title,
      description: desc,
      images: [{ url: route.image, width: 1200, height: 630, alt: `Fastboat ${route.destinationName}` }],
    },
  };
}

export default function RoutePage({ params }: Props) {
  const route = POPULAR_ROUTES.find((r) => r.id === params.slug);
  if (!route) notFound();

  const relatedRoutes = POPULAR_ROUTES.filter((r) => r.id !== route.id).slice(0, 3);
  const relatedServices = POPULAR_SERVICES.slice(0, 2);
  const relatedBlogs = BLOG_POSTS.filter(b => b.category === "fastboat" || b.relatedTags.includes("fastboat")).slice(0, 3);

  // JSON-LD schema for fastboat crossing without fixed price
  const routeSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": `Fastboat ${route.departurePort.split("(")[0].trim()} ke ${route.destinationName}`,
    "description": `Penyeberangan fastboat dari ${route.departurePort} menuju ${route.arrivalPort}. Durasi ${route.durationMinutes} menit.`,
    "provider": { "@type": "TravelAgency", "name": "BaliRide Transport", "url": "https://baliride-trans.com" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routeSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Back Nav */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <Link href="/#routes" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-600 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Rute</span>
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Details */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero image */}
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                <Image
                  src={route.image}
                  alt={`Fastboat ke ${route.destinationName}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
                    <Ship className="w-4 h-4" />
                    <span>Rute Fastboat Resmi</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold">
                    {route.departurePort.split("(")[0]}
                    <span className="text-teal-300 mx-2">→</span>
                    {route.destinationName}
                  </h1>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Clock, val: `${route.durationMinutes} Menit`, label: "Durasi Perjalanan" },
                  { icon: Users, val: `${route.schedules.length} Jadwal`, label: "Keberangkatan/Hari" },
                  { icon: Anchor, val: "Resmi", label: "Bersertifikat IMO" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="text-center p-4 rounded-xl bg-teal-50 border border-teal-100">
                    <Icon className="w-5 h-5 text-teal-600 mx-auto mb-1.5" />
                    <div className="text-base font-extrabold text-teal-700">{val}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>

              {/* Route Detail */}
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Detail Rute Penyeberangan</h2>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-brand-500" />
                      <div className="w-0.5 h-12 bg-slate-300 my-1" />
                      <div className="w-3 h-3 rounded-full bg-teal-500" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pelabuhan Berangkat</p>
                        <p className="text-sm font-bold text-slate-900">{route.departurePort}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pelabuhan Tujuan</p>
                        <p className="text-sm font-bold text-slate-900">{route.arrivalPort}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedules */}
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Jadwal Keberangkatan Tersedia</h2>
                <div className="flex flex-wrap gap-2">
                  {route.schedules.map((s) => (
                    <span key={s} className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-sm font-bold text-slate-800">
                      🕐 {s} WITA
                    </span>
                  ))}
                </div>
              </div>

              {/* Operators */}
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3">Operator Rekanan Resmi</h2>
                <div className="flex flex-wrap gap-2">
                  {route.operators.map((op) => (
                    <span key={op} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      🚢 {op}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Sticky Booking Order Form */}
            <div className="lg:col-span-2">
              <RoutePageClient route={route} />
            </div>
          </div>

          {/* Related Services & Other Routes Section */}
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Layanan Lainnya yang Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {relatedRoutes.map((rel) => (
                <Link key={rel.id} href={`/routes/${rel.id}`} className="group p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-card-hover bg-white transition-all">
                  <div className="relative h-28 rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <Image src={rel.image} alt={rel.destinationName} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-teal-700 mb-1">
                    <Ship className="w-3.5 h-3.5" />
                    <span>{rel.destinationName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{rel.departurePort.split("(")[0]} → {rel.destinationName}</h3>
                  <p className="text-xs text-slate-500 mt-1">{rel.schedules.length} Jadwal/Hari • {rel.durationMinutes} mnt</p>
                  <div className="flex items-center gap-1 text-xs text-teal-600 font-semibold mt-2">
                    <span>Lihat Rute</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}

              {relatedServices.slice(0, 1).map((svc) => (
                <Link key={svc.id} href={`/services/${svc.id}`} className="group p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-card-hover bg-white transition-all">
                  <div className="relative h-28 rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <Image src={svc.image} alt={svc.name} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-600 mb-1">
                    <Car className="w-3.5 h-3.5" />
                    <span>Armada & Supir</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{svc.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Kapasitas: {svc.capacity}</p>
                  <div className="flex items-center gap-1 text-xs text-brand-600 font-semibold mt-2">
                    <span>Lihat Layanan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Related Blogs Section */}
            {relatedBlogs.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-slate-900">Blog & Panduan Terkait</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((b) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all">
                      <div className="relative h-36 rounded-xl overflow-hidden mb-3.5 bg-slate-200">
                        <Image src={b.image} alt={b.title} fill sizes="300px" className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md">
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
