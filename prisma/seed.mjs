import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

const artworks = [
  {
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
  {
    id: "velazquez-las-meninas",
    title: "Las Meninas",
    artist: "Diego Velázquez",
    year: "1656",
    movement: "Baroque",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Las_Meninas_01.jpg",
    imagePageUrl: "https://commons.wikimedia.org/wiki/File:Las_Meninas_01.jpg",
    sourceUrl:
      "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f",
  },
  {
    id: "van-gogh-the-starry-night",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    movement: "Post-Impressionism",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    imagePageUrl:
      "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    sourceUrl: "https://www.moma.org/collection/works/79802",
  },
  {
    id: "mondrian-broadway-boogie-woogie",
    title: "Broadway Boogie Woogie",
    artist: "Piet Mondrian",
    year: "1942",
    movement: "De Stijl",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Piet_Mondrian%2C_1942_-_Broadway_Boogie_Woogie.jpg",
    imagePageUrl:
      "https://commons.wikimedia.org/wiki/File:Piet_Mondrian,_1942_-_Broadway_Boogie_Woogie.jpg",
    sourceUrl: "https://www.moma.org/collection/works/78682",
  },
  {
    id: "magritte-the-treachery-of-images",
    title: "The Treachery of Images",
    artist: "René Magritte",
    year: "1929",
    movement: "Surrealism",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Magritte_treachery.jpg",
    imagePageUrl: "https://commons.wikimedia.org/wiki/File:Magritte_treachery.jpg",
    sourceUrl: "https://collections.lacma.org/object/31931",
  },
  {
    id: "rodin-the-thinker",
    title: "The Thinker",
    artist: "Auguste Rodin",
    year: "1903",
    movement: "Modern Sculpture",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Thinker%2C_Rodin.jpg",
    imagePageUrl: "https://commons.wikimedia.org/wiki/File:The_Thinker,_Rodin.jpg",
    sourceUrl: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/thinker",
  },
  {
    id: "hokusai-the-great-wave-off-kanagawa",
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831",
    movement: "Ukiyo-e",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/The_Great_Wave_off_Kanagawa.jpg",
    imagePageUrl:
      "https://commons.wikimedia.org/wiki/File:The_Great_Wave_off_Kanagawa.jpg",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/45434",
  },
  {
    id: "malevich-black-square",
    title: "Black Square",
    artist: "Kazimir Malevich",
    year: "1915",
    movement: "Suprematism",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Malevich.black-square.jpg",
    imagePageUrl: "https://commons.wikimedia.org/wiki/File:Malevich.black-square.jpg",
    sourceUrl:
      "https://www.tate.org.uk/art/artists/kazimir-malevich-1561/five-ways-look-malevichs-black-square",
  },
  {
    id: "hopper-nighthawks",
    title: "Nighthawks",
    artist: "Edward Hopper",
    year: "1942",
    movement: "American Realism",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nighthawks_by_Edward_Hopper_1942.jpg",
    imagePageUrl:
      "https://commons.wikimedia.org/wiki/File:Nighthawks_by_Edward_Hopper_1942.jpg",
    sourceUrl: "https://www.artic.edu/artworks/111628/nighthawks",
  },
];

for (const artwork of artworks) {
  await prisma.artwork.upsert({
    where: { id: artwork.id },
    create: artwork,
    update: artwork,
  });
}

await prisma.$disconnect();
