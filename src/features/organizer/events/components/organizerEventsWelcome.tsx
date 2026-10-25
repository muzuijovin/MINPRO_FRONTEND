// Komponen ini TIDAK pakai "use client", karena isinya statis
// (tidak ada hook / onClick). Jadi cukup jadi Server Component biasa.
import Link from "next/link";
import { FiArrowLeft, FiCheckCircle, FiPlus } from "react-icons/fi";
import {
  CREATE_EVENT_STEPS,
  ORGANIZER_BENEFITS,
} from "../constants/organizerEventsData";

export function OrganizerEventsWelcome() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumbs mb-4 text-xs text-secondary/60">
        <ul>
          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li className="font-medium text-secondary">Event Saya</li>
        </ul>
      </div>

      {/* ===== Hero: ajakan membuat event ===== */}
      {/* bg-linear-to-br = gradasi warna dari kiri atas ke kanan bawah (Tailwind v4) */}
      <section className="rounded-3xl bg-linear-to-br from-primary to-orange-400 p-6 text-white sm:p-10">
        <span className="badge border-none bg-white/20 text-xs text-white">
          Untuk Penyelenggara Event
        </span>
        <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
          Mulai buat event olahragamu di SportTicketing
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
          Dari lomba lari, turnamen futsal, hingga kompetisi esports. Publikasikan
          event dan jual tiketnya hanya dalam beberapa menit.
        </p>

        {/* flex-col di HP (tombol bertumpuk), flex-row mulai layar sm (berjejer) */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/organizer/events/create"
            className="btn rounded-full border-none bg-white text-primary hover:bg-white/90"
          >
            <FiPlus />
            Buat Event Baru
          </Link>
          <Link
            href="/"
            className="btn btn-ghost rounded-full text-white hover:bg-white/10"
          >
            <FiArrowLeft />
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* ===== Langkah-langkah membuat event ===== */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Cara membuat event</h2>
        <p className="text-sm text-secondary/60">
          Cukup 4 langkah sampai event kamu tampil di halaman depan.
        </p>

        {/* 1 kolom di HP, 2 kolom di tablet, 4 kolom di desktop */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREATE_EVENT_STEPS.map((step, index) => {
            // ikon disimpan di constants sebagai komponen, jadi dipanggil seperti <Icon />
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-base-300 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-primary/10 p-2 text-lg text-primary">
                    <Icon />
                  </span>
                  {/* index mulai dari 0, makanya ditambah 1 */}
                  <span className="text-2xl font-bold text-base-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs text-secondary/60">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Keuntungan + ajakan terakhir ===== */}
      <section className="mt-10 grid items-center gap-6 rounded-2xl bg-neutral p-6 sm:p-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Kenapa jadi penyelenggara?</h2>
          <ul className="mt-4 space-y-3">
            {ORGANIZER_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm">
                <FiCheckCircle className="mt-0.5 shrink-0 text-tertiary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center">
          <p className="font-semibold">Siap mempublikasikan event?</p>
          <p className="mt-1 text-xs text-secondary/60">
            Form bisa diisi dalam waktu kurang dari 5 menit.
          </p>
          <Link
            href="/organizer/events/create"
            className="btn btn-primary mt-4 w-full rounded-full"
          >
            <FiPlus />
            Buat Event Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
