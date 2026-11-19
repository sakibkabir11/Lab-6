"use server";

import { prisma } from "@/lib/prisma";

export async function loadWorkspace() {
  const [users, groups, expenses, payments] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.group.findMany({ include: { memberships: { include: { user: true } } }, orderBy: { name: "asc" } }),
    prisma.expense.findMany({ include: { payer: true, shares: true, group: true }, orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
    prisma.payment.findMany({ include: { fromUser: true, toUser: true, group: true }, orderBy: { date: "desc" } }),
  ]);
  return { users, groups, expenses, payments };
}

export async function createExpense(input: {
  groupId: string; payerId: string; createdById: string; description: string;
  amountCents: number; date: string; splitMethod: "EQUAL" | "PERCENT";
  participants: { userId: string; percentage?: number }[];
  receiptDataUrl?: string;
}) {
  const description = input.description.trim();
  if (!description || !Number.isSafeInteger(input.amountCents) || input.amountCents <= 0 || !input.date || input.participants.length < 1) throw new Error("Add a description, a positive amount, date, payer, and at least one participant.");
  const members = await prisma.membership.findMany({ where: { groupId: input.groupId }, select: { userId: true } });
  const allowed = new Set(members.map((member) => member.userId));
  if (![input.payerId, input.createdById, ...input.participants.map((p) => p.userId)].every((id) => allowed.has(id))) throw new Error("Payer and participants must be current group members.");
  const unique = new Set(input.participants.map((p) => p.userId));
  if (unique.size !== input.participants.length) throw new Error("A participant can only be selected once.");
  let shares: { userId: string; amountCents: number; percentage?: number }[];
  if (input.splitMethod === "PERCENT") {
    const percentages = input.participants.map((p) => p.percentage ?? 0);
    const basisPoints = percentages.map((value) => Math.round(value * 100));
    if (percentages.some((value, index) => !Number.isFinite(value) || value < 0 || Math.abs(value * 100 - basisPoints[index]) > 1e-8) || basisPoints.reduce((sum, value) => sum + value, 0) !== 10000) throw new Error("Percentages must use up to two decimal places and add up to exactly 100%.");
    shares = input.participants.map((p) => ({ userId: p.userId, percentage: p.percentage, amountCents: 0 }));
    let assigned = 0;
    shares.forEach((share, index) => {
      share.amountCents = index === shares.length - 1 ? input.amountCents - assigned : Math.round(input.amountCents * basisPoints[index] / 10000);
      assigned += share.amountCents;
    });
  } else {
    const base = Math.floor(input.amountCents / input.participants.length);
    let remainder = input.amountCents - base * input.participants.length;
    shares = input.participants.map((p) => ({ userId: p.userId, amountCents: base + (remainder-- > 0 ? 1 : 0) }));
  }
  if (input.receiptDataUrl && (!/^data:image\/(png|jpeg|webp);base64,/.test(input.receiptDataUrl) || input.receiptDataUrl.length > 2_800_000)) throw new Error("Receipt must be a PNG, JPEG, or WebP image under 2 MB.");
  await prisma.expense.create({ data: {
    receiptDataUrl: input.receiptDataUrl, groupId: input.groupId, payerId: input.payerId, createdById: input.createdById,
    description, amountCents: input.amountCents, date: new Date(`${input.date}T12:00:00`), splitMethod: input.splitMethod,
    shares: { create: shares },
  } });
  return { ok: true };
}

export async function reviewExpense(input: { expenseId: string; reviewerId: string; decision: "APPROVED" | "REJECTED" }) {
  const expense = await prisma.expense.findUnique({ where: { id: input.expenseId } });
  if (!expense || expense.status !== "PENDING") throw new Error("This expense is no longer waiting for review.");
  const approver = await prisma.membership.findUnique({ where: { userId_groupId: { userId: input.reviewerId, groupId: expense.groupId } } });
  if (!approver?.isApprover) throw new Error("Only a designated group approver can review this expense.");
  await prisma.expense.update({ where: { id: expense.id }, data: { status: input.decision, reviewedById: input.reviewerId, reviewedAt: new Date() } });
  return { ok: true };
}

export async function recordPayment(input: { groupId: string; fromUserId: string; toUserId: string; amountCents: number; date: string; note?: string }) {
  if (!Number.isSafeInteger(input.amountCents) || input.amountCents <= 0 || input.fromUserId === input.toUserId) throw new Error("Enter a positive payment amount and two different group members.");
  const ids = [input.fromUserId, input.toUserId];
  const members = await prisma.membership.findMany({ where: { groupId: input.groupId, userId: { in: ids } } });
  if (members.length !== 2) throw new Error("Both people must be members of this group.");
  const [expenses, payments] = await Promise.all([
    prisma.expense.findMany({ where: { groupId: input.groupId, status: "APPROVED" }, include: { shares: true } }),
    prisma.payment.findMany({ where: { groupId: input.groupId } }),
  ]);
  let outstandingCents = 0;
  for (const expense of expenses) for (const share of expense.shares) {
    if (share.userId === input.fromUserId && expense.payerId === input.toUserId) outstandingCents += share.amountCents;
    if (share.userId === input.toUserId && expense.payerId === input.fromUserId) outstandingCents -= share.amountCents;
  }
  for (const payment of payments) {
    if (payment.fromUserId === input.fromUserId && payment.toUserId === input.toUserId) outstandingCents -= payment.amountCents;
    if (payment.fromUserId === input.toUserId && payment.toUserId === input.fromUserId) outstandingCents += payment.amountCents;
  }
  if (outstandingCents <= 0) throw new Error("There is no outstanding balance in that payment direction.");
  if (input.amountCents > outstandingCents) throw new Error(`Payment exceeds the outstanding ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(outstandingCents / 100)} balance.`);
  await prisma.payment.create({ data: { ...input, note: input.note?.trim() ?? "", date: new Date(`${input.date}T12:00:00`) } });
  return { ok: true };
}
