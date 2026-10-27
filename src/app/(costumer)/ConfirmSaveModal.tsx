
'use client';

interface ConfirmSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmSaveModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-save-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl text-[#FF6B1A]">
          !
        </div>

        <div className="text-center">
          <h2
            id="confirm-save-title"
            className="text-xl font-bold text-[#171A24]"
          >
            Confirm Save
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Are you sure you want to save the changes to your profile?
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-[9px] text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-[6px] rounded-xl bg-[#FF6B1A] px-4 py-[9px] text-sm font-semibold leading-5 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-[#E85D12]"
          >
            <span aria-hidden="true">✓</span>
            Confirm Save
          </button>
        </div>
      </div>
    </div>
  );
}
