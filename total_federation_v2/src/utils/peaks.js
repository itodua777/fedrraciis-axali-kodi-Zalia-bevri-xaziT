export const defaultPeaks = [
  { id: 1, name: "უშბა", height: 4710, system: "კავკასიონი", continent: "ევროპა", region: "სვანეთი, მესტიის მუნიციპალიტეტი", difficulty: "5B", isBorderZone: true, borderCountries: ["რუსეთი", "საქართველო"], lat: 43.1242, lng: 42.6421, firstAscent: "1888 წელი, ჯონ გარფორდ კოკინი — სამხრეთ მწვერვალი", description: "კავკასიონის ერთ-ერთი ყველაზე რთული მწვერვალი.", photo: "https://via.placeholder.com/150" }
];

export const getPersistedPeaks = () => {
  const saved = localStorage.getItem('peaksStore');
  if (saved) {
    try { return JSON.parse(saved); } catch(e){}
  }
  return defaultPeaks;
};
