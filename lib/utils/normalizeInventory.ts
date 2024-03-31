import { RecordModel } from 'pocketbase';
import { TThing } from '../types/pocketbase';

export function normalizeInventory(data: RecordModel[] | undefined): TThing[] {
  return (
    data?.map((item: RecordModel) => ({
      id: item.id,
      name: item.name,
      thing_type: item.expand?.thing_type,
      owner_user_id: item.owner_user_id,
    })) ?? []
  );
}

export function formatInventoryForDropdown(data: TThing[] | undefined) {
  return (
    data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? []
  );
}
