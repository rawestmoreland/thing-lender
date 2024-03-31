export async function fetchAllInventory(pb: any) {
  const allThings = await pb?.collection('things').getFullList({
    expand: 'lent_things_via_thing_id.returned',
  });

  console.log;
}
