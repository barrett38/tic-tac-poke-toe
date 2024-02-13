export async function getPokemon() {
  const randomId = Math.floor(Math.random() * 151) + 1; // For Pokemon ID between 1 and 151
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  console.log(data);

  return data.sprites.front_default;
}
