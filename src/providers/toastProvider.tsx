"use client";

import { ToastContainer } from "react-toastify";

// dipasang sekali di root layout, supaya toast.success / toast.error dari halaman mana pun bisa tampil
export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
    />
  );
}
