-- Add optional local image receipt storage to expenses.
ALTER TABLE "Expense" ADD COLUMN "receiptDataUrl" TEXT;
