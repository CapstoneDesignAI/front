import FavoritePlaceItem from "./FavoritePlaceItem";

type FavoritePlaceListProps = {
  onDeletePlace: (place: IBookmarkedPlaceItem) => void;
  places: IBookmarkedPlaceItem[];
};

export default function FavoritePlaceList({
  onDeletePlace,
  places,
}: FavoritePlaceListProps) {
  return places.map((place) => (
    <FavoritePlaceItem
      key={place.bookmark_id}
      place={place}
      onDelete={onDeletePlace}
    />
  ));
}
