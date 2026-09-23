import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const chairs = [
    { name: 'Pooja Sharma', username: 'pooja', pass: 'pooja123' },
    { name: 'Rahul Verma', username: 'rahul', pass: 'rahul123' },
    { name: 'Amit Kumar', username: 'amit', pass: 'amit123' },
  ]

  for (const c of chairs) {
    const passwordHash = await bcrypt.hash(c.pass, 10)
    await prisma.user.upsert({
      where: { username: c.username },
      update: {},
      create: {
        name: c.name,
        username: c.username,
        passwordHash,
        role: 'SESSION_CHAIR',
        status: 'ACTIVE',
      }
    })
  }

  // Create sample papers
  const papers = [
    { paperId: 'IEEE-2026-001', title: 'Advances in AI', authors: 'John Doe', abstract: 'An overview of AI', track: 'AI', session: 'S1', keywords: 'AI, CS' },
    { paperId: 'IEEE-2026-002', title: 'Quantum Computing', authors: 'Jane Smith', abstract: 'Quantum details', track: 'QC', session: 'S2', keywords: 'Quantum, Physics' },
  ]

  for (const p of papers) {
    await prisma.paper.upsert({
      where: { paperId: p.paperId },
      update: {},
      create: {
        ...p,
        status: 'UNASSIGNED'
      }
    })
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
