import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

await prisma.artwork.upsert({
  where: { id: "kandinsky-composition-viii" },
  create: {
    id: "kandinsky-composition-viii",
    title: "Composition VIII",
    artist: "Wassily Kandinsky",
    year: "1923",
    movement: "Abstract Art",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kandinsky_-_Composition_8%2C_July_1923.jpg",
    imagePageUrl:
      "https://commons.wikimedia.org/wiki/File:Kandinsky_-_Composition_8,_July_1923.jpg",
    sourceUrl: "https://www.guggenheim.org/artwork/1924",
  },
  update: {
    title: "Composition VIII",
    artist: "Wassily Kandinsky",
    year: "1923",
    movement: "Abstract Art",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kandinsky_-_Composition_8%2C_July_1923.jpg",
    imagePageUrl:
      "https://commons.wikimedia.org/wiki/File:Kandinsky_-_Composition_8,_July_1923.jpg",
    sourceUrl: "https://www.guggenheim.org/artwork/1924",
  },
});

await prisma.$disconnect();
