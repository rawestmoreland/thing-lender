import { TLentThing } from '@/lib/types/pocketbase';

/**
 * Fetches things that are available to be lent
 */
export async function fetchAvailableInventory(pb: any) {
  if (!pb) {
    return [];
  }

  const lentThings = await pb
    ?.collection('lent_things')
    .getFullList({ filter: 'returned=false' });

  const lentThingIds = lentThings?.map(
    (lentThing: TLentThing) => lentThing.thing_id
  );

  if (lentThingIds?.length === 0) {
    const allThings = await pb?.collection('things').getFullList();
    return allThings;
  }

  const notInFilter = lentThingIds
    .map((id: string) => `id!='${id}'`)
    .join(' && ');

  const availableThings = await pb?.collection('things').getFullList({
    filter: notInFilter,
  });

  return availableThings;
}
