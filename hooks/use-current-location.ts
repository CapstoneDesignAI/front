import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

type CurrentLocation = {
  latitude: number;
  longitude: number;
};

type CachedLocation = {
  coords: CurrentLocation;
  label: string;
};

let cachedLocation: CachedLocation | null = null;

export function useCurrentLocation() {
  const [coords, setCoords] = useState<CurrentLocation | null>(
    cachedLocation?.coords ?? null,
  );
  const [label, setLabel] = useState(cachedLocation?.label ?? "현재 위치");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!cachedLocation);

  const formatAddress = (
    addresses: Location.LocationGeocodedAddress[],
    coords: CurrentLocation,
  ) => {
    const address = addresses[0];

    if (!address) {
      return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
    }

    const primary = address.city ?? address.region;
    const secondary = address.district ?? address.subregion;
    const label = [primary, secondary].filter(Boolean).join(" ");

    return (
      label || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
    );
  };

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setLabel("위치 권한 필요");
        setErrorMessage("위치 권한이 허용되지 않았습니다.");
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextCoords = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      setCoords(nextCoords);

      const addresses = await Location.reverseGeocodeAsync(nextCoords);
      const nextLabel = formatAddress(addresses, nextCoords);

      cachedLocation = {
        coords: nextCoords,
        label: nextLabel,
      };

      setLabel(nextLabel);
    } catch {
      setLabel("위치 확인 실패");
      setErrorMessage("현재 위치를 가져오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cachedLocation) {
      refresh();
    }
  }, [refresh]);

  return {
    coords,
    errorMessage,
    isLoading,
    label,
    refresh,
  };
}
