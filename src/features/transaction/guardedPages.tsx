"use client";

import withAuthGuard from "@/hoc/withAuthGuard";
import { CheckoutSection } from "./checkout/checkoutSection";
import { TransactionHistorySection } from "./history/transactionHistory";
import { OrganizerTransactionDetailSection } from "./organizer/organizerTransactionDetail";
import { OrganizerTransactionListSection } from "./organizer/organizerTransactionList";
import { TransactionPaymentSection } from "./payment/transactionPayment";

// withAuthGuard tidak bisa dipanggil dari server component (page.tsx), jadi dibungkus di file client ini
export const GuardedCheckout = withAuthGuard(CheckoutSection, ["CUSTOMER"]);
export const GuardedTransactionHistory = withAuthGuard(TransactionHistorySection, ["CUSTOMER"]);
export const GuardedTransactionPayment = withAuthGuard(TransactionPaymentSection, ["CUSTOMER"]);
export const GuardedOrganizerTransactions = withAuthGuard(OrganizerTransactionListSection, ["EO"]);
export const GuardedOrganizerTransactionDetail = withAuthGuard(OrganizerTransactionDetailSection, ["EO"]);
