import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const papers = await prisma.paper.findMany({ 
    where: { paperId: { in: ['304', '651'] } } 
  });
  console.log('Papers found:', papers.map(p => p.paperId));
  
  const assignments = await prisma.paperAssignment.findMany({ 
    where: { paperId: { in: papers.map(p => p.id) } }, 
    include: { chair: true, paper: true } 
  });
  
  console.log('Current Assignments:');
  for (const a of assignments) {
    console.log(`- Paper ${a.paper.paperId} -> Chair ${a.chair.name} (AssignmentID: ${a.id})`);
  }

  // Find assignments involving Ravi
  const toDelete = assignments.filter(a => a.chair.name.toLowerCase().includes('ravi'));
  
  if (toDelete.length > 0) {
    for (const a of toDelete) {
      await prisma.paperAssignment.delete({ where: { id: a.id } });
      console.log(`Deleted assignment for Paper ${a.paper.paperId} to ${a.chair.name}`);
      
      // Also update paper status to UNASSIGNED if it has no other active assignments
      const otherAssignments = await prisma.paperAssignment.count({
        where: { paperId: a.paperId, id: { not: a.id } }
      });
      
      if (otherAssignments === 0) {
        await prisma.paper.update({
          where: { id: a.paperId },
          data: { status: 'UNASSIGNED' }
        });
        console.log(`Updated Paper ${a.paper.paperId} to UNASSIGNED`);
      }
    }
  } else {
    console.log('No assignments found linking these papers to Ravi.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
