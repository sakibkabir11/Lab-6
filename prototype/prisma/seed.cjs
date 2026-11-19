process.env.DATABASE_URL ||= 'file:./dev.db';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const day = (value) => new Date(`${value}T12:00:00.000Z`);

async function main() {
  const users = [
    { id: 'demo-alex', name: 'Alex Morgan', email: 'alex@splitsmart.demo', color: '#315c4c' },
    { id: 'demo-jamie', name: 'Jamie Chen', email: 'jamie@splitsmart.demo', color: '#d88768' },
    { id: 'demo-sam', name: 'Sam Rivera', email: 'sam@splitsmart.demo', color: '#7185a4' },
    { id: 'demo-taylor', name: 'Taylor Brooks', email: 'taylor@splitsmart.demo', color: '#b28445' },
  ];
  for (const user of users) await prisma.user.upsert({ where: { id: user.id }, update: user, create: user });
  const groups = [
    { id: 'group-cabin', name: 'Lake house weekend', emoji: '🏡', description: 'Cabin trip · Oct 18–20' },
    { id: 'group-flat', name: 'The Greenhouse', emoji: '🌿', description: 'Shared apartment' },
    { id: 'group-trip', name: 'Lisbon ’26', emoji: '✈️', description: 'Summer trip' },
  ];
  for (const group of groups) await prisma.group.upsert({ where: { id: group.id }, update: group, create: group });
  const membershipRows = [
    ['demo-alex', 'group-cabin', true], ['demo-jamie', 'group-cabin', true], ['demo-sam', 'group-cabin', false], ['demo-taylor', 'group-cabin', false],
    ['demo-alex', 'group-flat', true], ['demo-jamie', 'group-flat', false], ['demo-sam', 'group-flat', true],
    ['demo-alex', 'group-trip', true], ['demo-jamie', 'group-trip', false], ['demo-sam', 'group-trip', false], ['demo-taylor', 'group-trip', false],
  ];
  for (const [userId, groupId, isApprover] of membershipRows) await prisma.membership.upsert({ where: { userId_groupId: { userId, groupId } }, update: { isApprover }, create: { userId, groupId, isApprover } });
  const fixtures = [
    { id: 'expense-cabin-groceries', groupId: 'group-cabin', payerId: 'demo-alex', createdById: 'demo-alex', description: 'Groceries for the cabin', amountCents: 18640, date: day('2026-10-18'), splitMethod: 'EQUAL', status: 'APPROVED', shares: [['demo-alex', 4660], ['demo-jamie', 4660], ['demo-sam', 4660], ['demo-taylor', 4660]] },
    { id: 'expense-cabin-dinner', groupId: 'group-cabin', payerId: 'demo-jamie', createdById: 'demo-jamie', description: 'Dinner at Pine & Salt', amountCents: 12800, date: day('2026-10-19'), splitMethod: 'EQUAL', status: 'APPROVED', shares: [['demo-alex', 3200], ['demo-jamie', 3200], ['demo-sam', 3200], ['demo-taylor', 3200]] },
    { id: 'expense-cabin-fuel', groupId: 'group-cabin', payerId: 'demo-sam', createdById: 'demo-sam', description: 'Fuel & parking', amountCents: 7400, date: day('2026-10-20'), splitMethod: 'EQUAL', status: 'PENDING', shares: [['demo-alex', 1850], ['demo-jamie', 1850], ['demo-sam', 1850], ['demo-taylor', 1850]] },
    { id: 'expense-flat-internet', groupId: 'group-flat', payerId: 'demo-jamie', createdById: 'demo-jamie', description: 'October internet', amountCents: 7200, date: day('2026-10-14'), splitMethod: 'EQUAL', status: 'APPROVED', shares: [['demo-alex', 2400], ['demo-jamie', 2400], ['demo-sam', 2400]] },
    { id: 'expense-trip-hotel', groupId: 'group-trip', payerId: 'demo-alex', createdById: 'demo-alex', description: 'Boutique hotel deposit', amountCents: 24000, date: day('2026-09-02'), splitMethod: 'PERCENT', status: 'APPROVED', shares: [['demo-alex', 6000], ['demo-jamie', 7200], ['demo-sam', 6000], ['demo-taylor', 4800]] },
  ];
  for (const item of fixtures) {
    const { shares, ...expense } = item;
    await prisma.expense.upsert({ where: { id: item.id }, update: expense, create: expense });
    for (const [userId, amountCents] of shares) {
      const id = `${item.id}-${userId}`;
      await prisma.expenseShare.upsert({ where: { id }, update: { amountCents }, create: { id, expenseId: item.id, userId, amountCents } });
    }
  }
  const payments = [
    { id: 'payment-cabin-jamie', groupId: 'group-cabin', fromUserId: 'demo-jamie', toUserId: 'demo-alex', amountCents: 3000, date: day('2026-10-21'), note: 'Cabin groceries' },
    { id: 'payment-flat-sam', groupId: 'group-flat', fromUserId: 'demo-alex', toUserId: 'demo-sam', amountCents: 1200, date: day('2026-10-16'), note: 'Utilities' },
  ];
  for (const payment of payments) await prisma.payment.upsert({ where: { id: payment.id }, update: payment, create: payment });
  console.log('SplitSmart demo data is ready.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
