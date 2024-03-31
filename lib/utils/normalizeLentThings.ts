import { RecordModel } from 'pocketbase';
import { TLentThing as TLentThing } from '../types/pocketbase';

export function normalizeLentThings(
  data: RecordModel[] | undefined
): TLentThing[] {
  const now = new Date();
  return (
    data?.map((item: RecordModel) => ({
      id: item.id,
      dueDate: new Date(item.due_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      returned: item.returned,
      thing: item.expand?.thing_id,
      borrower: item.expand?.borrower_id,
      thingType: item.expand?.thing_id?.expand?.thing_type,
      pastDue: new Date(item.due_date) < now,
    })) ?? []
  );
}
