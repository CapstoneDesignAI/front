import FavoritePlaceItem from "./FavoritePlaceItem";
import type { FavoritePlace } from "./types";

type FavoritePlaceListProps = {
  places: FavoritePlace[];
};

export default function FavoritePlaceList({ places }: FavoritePlaceListProps) {
  return places.map((place) => (
    <FavoritePlaceItem key={place.id} place={place} />
  ));
}
