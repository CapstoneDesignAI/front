import FavoritePlaceItem from "./FavoritePlaceItem";

type FavoritePlace = {
  id: number;
  name: string;
  distance: string;
  description: string;
  tags: string[];
};

type FavoritePlaceListProps = {
  places: FavoritePlace[];
};

export default function FavoritePlaceList({ places }: FavoritePlaceListProps) {
  return places.map((place) => (
    <FavoritePlaceItem key={place.id} place={place} />
  ));
}
