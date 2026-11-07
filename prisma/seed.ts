import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.project.upsert({
    where: { slug: "gesture-controlled-home" },
    update: {},
    create: { title: "Gesture-controlled Home Automation", slug: "gesture-controlled-home", description: "Touchless IoT home control with hand gestures.", tags: "Arduino,OpenCV,MediaPipe", featured: true },
  });
}

main().finally(() => prisma.$disconnect());
