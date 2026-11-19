"use server";

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function loadWorkspace() {
  const [users, groups, expenses, payments] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.group.findMany({ include: { memberships: { include: { user: true } } }, orderBy: { name: "asc" } }),
    prisma.expense.findMany({ include: { payer: true, shares: true, group: true }, orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
    prisma.payment.findMany({ include: { fromUser: true, toUser: true, group: true }, orderBy: { date: "desc" } }),
  ]);
  return { users, groups, expenses, payments };
}

export async function createGroup(input: {
  name: string;
  emoji: string;
  description?: string;
  creatorId: string;
}) {
  if (!input || typeof input.name !== "string") throw new Error("Enter a group name with no more than 80 characters.");
  const name = input.name.trim();
  if (!name || name.length > 80) throw new Error("Enter a group name with no more than 80 characters.");
  if (typeof input.creatorId !== "string" || !input.creatorId) throw new Error("Choose a group member to create this group.");
  const creator = await prisma.user.findUnique({ where: { id: input.creatorId }, select: { id: true } });
  if (!creator) throw new Error("That member could not be found.");

  const emoji = typeof input.emoji === "string" ? input.emoji.trim().slice(0, 8) || "🏡" : "🏡";
  const description = typeof input.description === "string" ? input.description.trim().slice(0, 120) : "";
  const group = await prisma.group.create({
    data: {
      name,
      emoji,
      description,
      memberships: { create: { userId: creator.id, isApprover: true } },
    },
    select: { id: true },
  });
  return { id: group.id };
}

export async function addGroupMember(input: { groupId: string; name: string }) {
  if (!input || typeof input.name !== "string") throw new Error("Enter a member name with no more than 80 characters.");
  const name = input.name.trim();
  if (typeof input.groupId !== "string" || !input.groupId || !name || name.length > 80) {
    throw new Error("Enter a member name with no more than 80 characters.");
  }
  const colors = ["#315c4c", "#d88768", "#7185a4", "#b28445", "#8067a5", "#54899a"];
  return prisma.$transaction(async (transaction) => {
    const group = await transaction.group.findUnique({ where: { id: input.groupId }, select: { id: true } });
    if (!group) throw new Error("That group could not be found.");
    const memberCount = await transaction.user.count();
    const user = await transaction.user.create({
      data: {
        name,
        email: `member-${randomUUID()}@splitsmart.local`,
        color: colors[memberCount % colors.length],
        memberships: { create: { groupId: group.id } },
      },
      select: { id: true },
    });
    return { id: user.id };
  });
}

export async function createExpense(input: {
  groupId: string; payerId: string; createdById: string; description: string;
  amountCents: number; date: string; splitMethod: "EQUAL" | "PERCENT";
  participants: { userId: string; percentage?: number }[];
  receiptDataUrl?: string;
}) {
  if (!input || typeof input.description !== "string") throw new Error("Enter an expense description.");
  const description = input.description.trim();
  if (!description || description.length > 100 || !Number.isSafeInteger(input.amountCents) || input.amountCents <= 0 || input.amountCents > 2_147_483_647) throw new Error("Add a description and a positive amount of up to $21,474,836.47.");
  if (!isValidDateOnly(input.date)) throw new Error("Enter a valid expense date.");
  if (!Array.isArray(input.participants) || input.participants.length < 1) throw new Error("Select at least one participant.");
  if (input.splitMethod !== "EQUAL" && input.splitMethod !== "PERCENT") throw new Error("Choose a valid split method.");
  if (!input.groupId || typeof input.payerId !== "string" || typeof input.createdById !== "string" || input.participants.some((participant) => !participant || typeof participant.userId !== "string")) {
    throw new Error("Payer and participants must be current group members.");
  }
  const members = await prisma.membership.findMany({ where: { groupId: input.groupId }, select: { userId: true } });
  const allowed = new Set(members.map((member) => member.userId));
  if (![input.payerId, input.createdById, ...input.participants.map((p) => p.userId)].every((id) => allowed.has(id))) throw new Error("Payer and participants must be current group members.");
  const unique = new Set(input.participants.map((p) => p.userId));
  if (unique.size !== input.participants.length) throw new Error("A participant can only be selected once.");
  const participants = [...input.participants].sort((a, b) => a.userId.localeCompare(b.userId));
  let shares: { userId: string; amountCents: number; percentage?: number }[];
  if (input.splitMethod === "PERCENT") {
    const percentages = participants.map((p) => p.percentage ?? 0);
    const basisPoints = percentages.map((value) => Math.round(value * 100));
    if (percentages.some((value, index) => !Number.isFinite(value) || value < 0 || Math.abs(value * 100 - basisPoints[index]) > 1e-8) || basisPoints.reduce((sum, value) => sum + value, 0) !== 10000) throw new Error("Percentages must use up to two decimal places and add up to exactly 100%.");
    shares = participants.map((p) => ({ userId: p.userId, percentage: p.percentage, amountCents: 0 }));
    let assigned = 0;
    shares.forEach((share, index) => {
      share.amountCents = index === shares.length - 1 ? input.amountCents - assigned : Math.round(input.amountCents * basisPoints[index] / 10000);
      assigned += share.amountCents;
    });
  } else {
    const base = Math.floor(input.amountCents / input.participants.length);
    let remainder = input.amountCents - base * input.participants.length;
    shares = participants.map((p) => ({ userId: p.userId, amountCents: base + (remainder-- > 0 ? 1 : 0) }));
  }
  if (input.receiptDataUrl && (!/^data:image\/(png|jpeg|webp);base64,/.test(input.receiptDataUrl) || input.receiptDataUrl.length > 2_800_000)) throw new Error("Receipt must be a PNG, JPEG, or WebP image under 2 MB.");
  await prisma.expense.create({ data: {
    receiptDataUrl: input.receiptDataUrl, groupId: input.groupId, payerId: input.payerId, createdById: input.createdById,
    description, amountCents: input.amountCents, date: new Date(`${input.date}T12:00:00.000Z`), splitMethod: input.splitMethod, status: "APPROVED",
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
  if (!input || typeof input.fromUserId !== "string" || typeof input.toUserId !== "string" || !input.groupId || !Number.isSafeInteger(input.amountCents) || input.amountCents <= 0 || input.fromUserId === input.toUserId) throw new Error("Enter a positive payment amount and two different group members.");
  if (!isValidDateOnly(input.date)) throw new Error("Enter a valid payment date.");
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
  await prisma.payment.create({ data: { ...input, note: input.note?.trim() ?? "", date: new Date(`${input.date}T12:00:00.000Z`) } });
  return { ok: true };
}
