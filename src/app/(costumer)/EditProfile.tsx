
'use client';

import { useState } from 'react';
import {
  UserRound,
  Camera,
  Upload,
  Phone,
  Copy,
  LockKeyhole,
  Save,
  CalendarDays,
  ContactRound,
} from 'lucide-react';
import ConfirmSaveModal from './ConfirmSaveModal';

export default function EditProfile() {
  const [fullName, setFullName] = useState('Alex Pratama');
  const [phoneNumber, setPhoneNumber] = useState('+62 812-3456-7890');
  const [dateOfBirth, setDateOfBirth] = useState('1996-08-14');
  const [username, setUsername] = useState('alexpratama');
  const [email, setEmail] = useState('alex.pratama@example.com');
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  const referralCode = 'JVLN-ALEX99';

  async function handleCopyReferralCode() {
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch {
      window.prompt('Copy referral code:', referralCode);
    }
  }

  function handleSaveChanges() {
    // Sambungkan ke API update profile setelah endpoint backend tersedia.
    setIsConfirmSaveOpen(false);
    alert('UI siap. Hubungkan tombol ini ke API untuk menyimpan perubahan.');
  }

  const inputClass =
    'h-9 w-full rounded-md border border-transparent bg-[#EEF3FF] px-3 text-xs text-[#24334F] outline-none transition focus:border-[#FF650F] focus:ring-2 focus:ring-[#FF650F]/10';

  const labelClass =
    'mb-1 block text-[11px] font-semibold text-[#172B4D]';

  return (
    <>
      {/* Edit Profile Card */}
      <section className="mx-auto max-w-[656px] rounded-xl border border-[#F0F2F8] bg-white p-5 shadow-sm sm:p-6">
        <div className="border-b border-[#E7ECF7] pb-4">
          <h2 className="text-base font-semibold">Edit Profile</h2>
          <p className="mt-1 text-xs text-[#52688C]">
            Edit your personal information and profile picture.
          </p>
        </div>

        {/* Profile Photo */}
        <div className="flex items-center gap-4 border-b border-[#E7ECF7] py-5">
          <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-4 border-[#E9F0FF] bg-[#F0F4FF]">
            <UserRound size={32} className="text-[#52688C]" />

            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 rounded-full bg-[#FF650F] p-1.5 text-white shadow"
            >
              <Camera size={13} />
            </button>
          </div>

          <div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-[#E8EEFF] px-3 py-2 text-[11px] font-semibold text-[#18345D]"
            >
              <Upload size={12} />
              Change Photo
            </button>

            <p className="mt-1 text-[10px] text-[#7183A1]">
              JPG, PNG up to 5MB. 400×400px recommended.
            </p>
          </div>
        </div>

        {/* Personal Details */}
        <section className="border-b border-[#E7ECF7] py-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Personal Details</h3>
            <ContactRound size={15} className="text-[#52688C]" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <span className={labelClass}>
                Full Name <span className="text-[#FF650F]">*</span>
              </span>

              <input
                type="text"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            <label>
              <span className={labelClass}>
                Phone Number <span className="text-[#FF650F]">*</span>
              </span>

              <span className="relative block">
                <input
                  type="tel"
                  className={`${inputClass} pr-9`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />

                <Phone
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52688C]"
                />
              </span>
            </label>

            <label className="sm:col-span-1">
              <span className={labelClass}>Date of Birth</span>

              <span className="relative block">
                <input
                  type="date"
                  className={`${inputClass} pr-8`}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />

                <CalendarDays
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#52688C]"
                />
              </span>
            </label>
          </div>
        </section>

        {/* Account Information */}
        <section className="border-b border-[#E7ECF7] py-5">
          <h3 className="mb-4 text-sm font-semibold">
            Account Information
          </h3>

          <div className="space-y-3">
            <label className="block">
              <span className={labelClass}>
                Username <span className="text-[#FF650F]">*</span>
              </span>

              <input
                type="text"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label>
                <span className={labelClass}>
                  Email Address <span className="text-[#FF650F]">*</span>
                </span>

                <input
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <div>
                <span className={labelClass}>Role</span>

                <div className="flex h-9 items-center justify-between rounded-md border border-[#E1E7F0] bg-[#F1F4F9] px-3">
                  <span className="flex items-center gap-2 text-[10px] font-semibold text-[#40516D]">
                    <span className="h-2 w-2 rounded-full bg-[#FF650F]" />
                    CUSTOMER
                  </span>

                  <span className="text-[9px] text-[#8A9BB5]">
                    READ-ONLY
                  </span>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className={labelClass}>Referral Code</span>

                <span className="text-[10px] text-[#8A9BB5]">
                  Permanent code
                </span>
              </div>

              <div className="flex gap-2">
                <div className="flex h-9 min-w-0 flex-1 items-center justify-between rounded-md border border-[#E1E7F0] bg-[#F1F4F9] px-3">
                  <span className="truncate text-[10px] font-bold tracking-wider text-[#40516D]">
                    {referralCode}
                  </span>

                  <LockKeyhole
                    size={12}
                    className="shrink-0 text-[#8A9BB5]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCopyReferralCode}
                  className="flex h-9 items-center gap-1.5 rounded-md border border-[#E1E7F0] bg-[#F8FAFF] px-3 text-[11px] font-semibold text-[#40516D] hover:bg-[#EEF3FF]"
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Save Changes */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => setIsConfirmSaveOpen(true)}
            className="flex h-9 items-center gap-2 rounded-full bg-[#FF650F] px-5 text-xs font-semibold text-white shadow-md transition hover:bg-[#E95700]"
          >
            <Save size={13} />
            Save Changes
          </button>
        </div>
      </section>

      {/* Confirm Save Modal */}
      <ConfirmSaveModal
        isOpen={isConfirmSaveOpen}
        onClose={() => setIsConfirmSaveOpen(false)}
        onConfirm={handleSaveChanges}
      />
    </>
  );
}
