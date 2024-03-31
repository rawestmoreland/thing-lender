export type TThingType = {
  id: string;
  name: EThingType;
};

export enum EThingType {
  Book = 'Book',
  Clothing = 'Clothing',
  Electronics = 'Electronics',
  Shoes = 'Shoes',
  Tool = 'Tool',
  Other = 'Other',
}

export type TThing = {
  id: string;
  name: string;
  thingType: TThingType;
  owner_user_id?: string;
  isLent: boolean;
  lentTo?: TBorrower;
  dueDate?: string;
  lentThing?: TLentThing;
};

export type TBorrower = {
  id: string;
  borrower_user_id: string;
  name: string;
  email: string;
  phone_number?: string;
  owner_user_id: string;
};

export type TLentThing = {
  id: string;
  dueDate: string;
  returned: boolean;
  thing: TThing;
  borrower: TBorrower;
  thingType: TThingType;
  pastDue: boolean;
  thing_id?: string;
};
