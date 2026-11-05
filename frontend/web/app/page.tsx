'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Search, ChevronDown, ChevronUp, Map, ArrowLeft, CalendarCheck, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import ClinicMapClient from '@/app/components/clinic-map-client';

/* ─────────────────────────── static data ─────────────────────────── */

const dentistsByClinic: Record<string, { value: string; label: string; specialty: string; rating: number }[]> = {
  monterrey: [
    { value: 'dr_garcia', label: 'Dr. Carlos García', specialty: 'Ortodoncia', rating: 4.9 },
    { value: 'dra_lopez', label: 'Dra. Ana López', specialty: 'General', rating: 4.8 },
  ],
  cdmx: [
    { value: 'dr_martinez', label: 'Dr. Luis Martínez', specialty: 'Endodoncia', rating: 4.7 },
    { value: 'dra_hernandez', label: 'Dra. Sofía Hernández', specialty: 'General', rating: 4.9 },
  ],
  guadalajara: [
    { value: 'dr_ramirez', label: 'Dr. Jorge Ramírez', specialty: 'Periodoncia', rating: 4.8 },
    { value: 'dra_torres', label: 'Dra. María Torres', specialty: 'Ortodoncia', rating: 4.7 },
  ],
};

const clinicLabels: Record<string, string> = {
  monterrey: 'Clínica Monterrey',
  cdmx: 'Clínica CDMX',
  guadalajara: 'Clínica Guadalajara',
};

const allDentists = Object.entries(dentistsByClinic).flatMap(([clinic, dentists]) =>
  dentists.map((d) => ({
    ...d,
    clinic,
    clinicLabel: clinicLabels[clinic] ?? clinic,
  }))
);

const FEATURES = [
  {
    icon: <CalendarCheck className="h-7 w-7 text-blue-500" />,
    title: 'Agenda en línea',
    desc: 'Tus pacientes reservan citas 24/7 sin llamadas.',
  },
  {
    icon: <Users className="h-7 w-7 text-blue-500" />,
    title: 'Gestión de pacientes',
    desc: 'Historial, expedientes y seguimiento en un solo lugar.',
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-blue-500" />,
    title: 'Perfil verificado',
    desc: 'Genera confianza con reseñas y credenciales visibles.',
  },
];

/* ─────────────────────────── component ─────────────────────────── */

const INITIAL_DENTIST_COUNT = 3;

export default function Home() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [slide, setSlide] = useState(0); // 0 = dentist list, 1 = map
  const [animating, setAnimating] = useState(false);

  const dentistSectionRef = useRef<HTMLDivElement>(null);
  const promoSectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredDentists = allDentists.filter(
    (d) =>
      d.label.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.clinicLabel.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleDentists = showAll ? filteredDentists : filteredDentists.slice(0, INITIAL_DENTIST_COUNT);
  const hasMore = !showAll && filteredDentists.length > INITIAL_DENTIST_COUNT;

  function goToSlide(index: number) {
    if (animating || index === slide) return;
    setAnimating(true);
    setSlide(index);
  }

  function scrollToPromo() {
    promoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToDentists() {
    dentistSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (animating) {
      const t = setTimeout(() => setAnimating(false), 700);
      return () => clearTimeout(t);
    }
  }, [animating]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">

      {/* ── Slides container ── */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex h-full w-[200%] transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(${slide === 0 ? '0%' : '-50%'})` }}
        >

          {/* ── Slide 0: Dentists + Promo (vertical scroll) ── */}
          <section
            ref={scrollContainerRef}
            className="w-1/2 h-full bg-gradient-to-b from-blue-50 to-white overflow-y-auto flex flex-col"
          >
            {/* ── Panel A: Dentist list ── */}
            <div ref={dentistSectionRef} className="min-h-full flex flex-col shrink-0">
              {/* ── Inline nav (no separate header) ── */}
              <div className="container mx-auto px-4 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <span className="text-lg font-bold">Dientex</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToSlide(1)}
                  className="flex items-center gap-1.5"
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Ver consultorios en el mapa</span>
                  <span className="sm:hidden">Mapa</span>
                </Button>
              </div>

              <div className="container mx-auto px-4 pt-4 pb-4 text-center">
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                  Agenda tu Cita Dental
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Rápido, fácil — para ti y para quien quieras.
                </p>
              </div>

              <div className="container mx-auto px-4 py-6 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Nuestros dentistas</h2>
                <p className="text-center text-muted-foreground text-sm mb-4">Especialistas en todas las clínicas</p>

                <div className="relative max-w-xs mx-auto mb-6">
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Buscar dentista, especialidad…"
                    aria-label="Buscar dentista por nombre, especialidad o clínica"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
                    className="pl-9"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
                  {filteredDentists.length === 0 ? (
                    <p className="col-span-full text-center text-sm text-muted-foreground py-8">
                      Sin resultados para &ldquo;{search}&rdquo;
                    </p>
                  ) : (
                    visibleDentists.map((d) => (
                      <Card key={d.value} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-5 pb-4 px-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
                              🦷
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{d.label}</p>
                              <p className="text-xs text-muted-foreground">{d.specialty}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground truncate">{d.clinicLabel}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-medium">{d.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Link href="/dashboard">
                            <Button size="sm" className="w-full mt-3">
                              Reservar
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {hasMore && (
                  <div className="text-center mt-6">
                    <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
                      Ver más
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>

              {/* ── CTA to promo panel ── */}
              <div className="text-center py-8 shrink-0">
                <button
                  type="button"
                  onClick={scrollToPromo}
                  className="inline-flex flex-col items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors group"
                >
                  <span className="font-medium">Utiliza dientex en tu consultorio</span>
                  <ChevronDown className="h-5 w-5 animate-bounce group-hover:animate-none" />
                </button>
              </div>
            </div>

            {/* ── Panel B: Dentist promo ── */}
            <div
              ref={promoSectionRef}
              className="min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 px-6 py-12 shrink-0 relative"
            >
              {/* Up button */}
              <button
                type="button"
                onClick={scrollToDentists}
                aria-label="Volver arriba"
                className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors group"
              >
                <ChevronUp className="h-6 w-6 animate-bounce group-hover:animate-none" />
              </button>

              <div className="max-w-lg w-full text-center mt-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-blue-600 font-bold text-2xl">D</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Haz crecer tu consultorio con Dientex
                </h2>
                <p className="text-blue-100 text-sm sm:text-base mb-8">
                  La plataforma que conecta dentistas con pacientes. Crea tu perfil, registra tus consultorios y empieza a recibir citas hoy.
                </p>

                <div className="grid gap-4 sm:grid-cols-3 mb-10">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                      <div className="mb-2">{f.icon}</div>
                      <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                      <p className="text-blue-100 text-xs">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 shadow-lg">
                    Crear perfil de dentista
                  </Button>
                </Link>
                <p className="text-blue-200 text-xs mt-3">
                  Gratis para empezar · Sin tarjeta de crédito
                </p>
              </div>
            </div>
          </section>

          {/* ── Slide 2: Map fullscreen ── */}
          <section className="w-1/2 h-full relative">
            <div className="absolute inset-0">
              <ClinicMapClient onBack={() => goToSlide(0)} />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
