export enum Countries {
  USA = 'USA',
  UK = 'UK',
  CANADA = 'CANADA',
  AUSTRALIA = 'AUSTRALIA',
  GERMANY = 'GERMANY',
}

export const countriesList = Object.values(Countries);

export const countryFlags = {
  [Countries.USA]: '🇺🇸',
  [Countries.UK]: '🇬🇧',
  [Countries.CANADA]: '🇨🇦',
  [Countries.AUSTRALIA]: '🇦🇺',
  [Countries.GERMANY]: '🇩🇪',
};
