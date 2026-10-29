"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiFolder, FiImage, FiSend, FiX } from "react-icons/fi";
import { PROOF_ACCEPT, PROOF_EXTENSIONS, PROOF_MAX_SIZE_MB } from "../constants/transactionStatus";
import { useUploadPaymentProof } from "../hooks/useTransactions";
import { focusRing, getErrorMessage } from "../components/transactionUi";

// validasi sama dengan BE: ekstensi huruf kecil jpg/jpeg/png/webp
const validateFile = (file: File) => {
  const extension = file.name.split(".").pop() ?? "";
  if (!PROOF_EXTENSIONS.includes(extension))
    return `Format harus ${PROOF_EXTENSIONS.join(", ")} (huruf kecil), contoh: bukti.jpg`;
  if (file.size > PROOF_MAX_SIZE_MB * 1024 * 1024)
    return `Ukuran file maksimal ${PROOF_MAX_SIZE_MB} MB`;
  return null;
};

export function ProofUploader({ transactionId, disabled }: { transactionId: string; disabled: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: upload, isPending } = useUploadPaymentProof(transactionId);

  // object URL lama dibuang tiap ganti file / unmount supaya tidak bocor memori
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pickFile = (picked?: File) => {
    if (!picked) return;
    const error = validateFile(picked);
    if (error) {
      toast.error(error);
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) pickFile(e.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const onSubmit = () => {
    if (!file) return;
    upload(file, {
      onSuccess() {
        toast.success("Bukti pembayaran terkirim, menunggu konfirmasi penyelenggara");
        clearFile();
      },
      onError(error) {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {file && preview ? (
        <div className="relative overflow-hidden rounded-xl bg-surface-muted">
          <div className="relative h-72 w-full">
            <Image src={preview} alt="Pratinjau bukti pembayaran" fill unoptimized className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Hapus file terpilih"
              className={`flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-sunken text-ink hover:bg-gray-200 ${focusRing}`}
            >
              <FiX aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-text ${
            disabled
              ? "cursor-not-allowed border-line bg-surface-muted opacity-60"
              : isDragging
                ? "cursor-pointer border-primary bg-accent-soft/30"
                : "cursor-pointer border-primary/40 bg-accent-soft/10 hover:bg-accent-soft/20"
          }`}
        >
          <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-white text-accent-text shadow-sm">
            <FiImage size={24} />
          </span>
          <span className="text-base font-bold text-ink">Tarik & lepaskan bukti transfer di sini</span>
          <span className="text-sm text-ink-muted">
            Format JPG, PNG atau WEBP, maksimal {PROOF_MAX_SIZE_MB} MB.
          </span>
          <span className="flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-sm">
            <FiFolder aria-hidden />
            Pilih Berkas dari Perangkat
          </span>
          <input
            type="file"
            accept={PROOF_ACCEPT}
            disabled={disabled}
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!file || isPending || disabled}
        className={`flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${focusRing}`}
      >
        {isPending ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <FiSend aria-hidden />
            Kirim Bukti Pembayaran
          </>
        )}
      </button>
    </div>
  );
}
