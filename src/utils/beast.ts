export const beasts = [
  { id: 1, name: 'Avestruz' },
  { id: 2, name: 'Águia' },
  { id: 3, name: 'Burro' },
  { id: 4, name: 'Borboleta' },
  { id: 5, name: 'Cachorro' },
  { id: 6, name: 'Cabra' },
  { id: 7, name: 'Carneiro' },
  { id: 8, name: 'Camelo' },
  { id: 9, name: 'Cobra' },
  { id: 10, name: 'Coelho' },
  { id: 11, name: 'Cavalo' },
  { id: 12, name: 'Elefante' },
  { id: 13, name: 'Galo' },
  { id: 14, name: 'Gato' },
  { id: 15, name: 'Jacaré' },
  { id: 16, name: 'Leão' },
  { id: 17, name: 'Macaco' },
  { id: 18, name: 'Porco' },
  { id: 19, name: 'Pavão' },
  { id: 20, name: 'Peru' },
  { id: 21, name: 'Touro' },
  { id: 22, name: 'Tigre' },
  { id: 23, name: 'Urso' },
  { id: 24, name: 'Veado' },
  { id: 25, name: 'Vaca' }
];

export const getBeastOptions = () => {
  return beasts.map((beast) => ({
    name: beast.name,
    value: beast.id
  }));
};
