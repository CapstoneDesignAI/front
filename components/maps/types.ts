export type FavoritePlace = {
  id: number;
  name: string;
  distance: string;
  description: string;
  tags: string[];
};

export type FavoriteFolder = {
  id: number;
  name: string;
  description: string;
  places: FavoritePlace[];
};
