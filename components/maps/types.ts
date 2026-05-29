export type FavoritePlace = {
  id: number;
  name: string;
  distance: string;
  description: string;
  tags: string[];
};

export type FavoriteFolder = {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  bookmarkCount?: number;
  places: FavoritePlace[];
};
