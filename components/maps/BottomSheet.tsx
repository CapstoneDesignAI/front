import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, ScrollView, View } from "react-native";

import BottomSheetHeader from "./BottomSheetHeader";
import { favoriteFolders } from "./favoriteFolders";
import FavoriteFolderList from "./FavoriteFolderList";
import FavoritePlaceList from "./FavoritePlaceList";

const COLLAPSED_SHEET_HEIGHT = 30;
const EXPANDED_SHEET_HEIGHT = 600;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function BottomSheet() {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const sheetHeight = useRef(
    new Animated.Value(COLLAPSED_SHEET_HEIGHT),
  ).current;
  const currentHeightRef = useRef(COLLAPSED_SHEET_HEIGHT);
  const dragStartHeightRef = useRef(COLLAPSED_SHEET_HEIGHT);

  useEffect(() => {
    const listener = sheetHeight.addListener(({ value }) => {
      currentHeightRef.current = value;
    });

    return () => {
      sheetHeight.removeListener(listener);
    };
  }, [sheetHeight]);

  const snapSheet = (toValue: number) => {
    currentHeightRef.current = toValue;
    setIsExpanded(toValue === EXPANDED_SHEET_HEIGHT);
    Animated.spring(sheetHeight, {
      toValue,
      useNativeDriver: false,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    }).start();
  };

  const selectedFolder = useMemo(() => {
    return favoriteFolders.find((folder) => folder.id === selectedFolderId);
  }, [selectedFolderId]);

  const openFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
    snapSheet(EXPANDED_SHEET_HEIGHT);
  };

  const toggleSheet = () => {
    snapSheet(
      currentHeightRef.current >
        (COLLAPSED_SHEET_HEIGHT + EXPANDED_SHEET_HEIGHT) / 2
        ? COLLAPSED_SHEET_HEIGHT
        : EXPANDED_SHEET_HEIGHT,
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8,
      onPanResponderGrant: () => {
        dragStartHeightRef.current = currentHeightRef.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const nextHeight = clamp(
          dragStartHeightRef.current - gestureState.dy,
          COLLAPSED_SHEET_HEIGHT,
          EXPANDED_SHEET_HEIGHT,
        );

        currentHeightRef.current = nextHeight;
        sheetHeight.setValue(nextHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldExpand =
          gestureState.vy < -0.45 ||
          (gestureState.vy <= 0.45 &&
            currentHeightRef.current >
              (COLLAPSED_SHEET_HEIGHT + EXPANDED_SHEET_HEIGHT) / 2);

        snapSheet(
          shouldExpand ? EXPANDED_SHEET_HEIGHT : COLLAPSED_SHEET_HEIGHT,
        );
      },
    }),
  ).current;

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white pb-[18px] shadow-xl"
      style={{ height: sheetHeight }}
    >
      <View
        {...panResponder.panHandlers}
        className="items-center pb-2 pt-[10px]"
      >
        <View className="h-1 w-[42px] rounded-full bg-gray-04" />
      </View>
      <BottomSheetHeader
        folderCount={favoriteFolders.length}
        isExpanded={isExpanded}
        selectedFolder={selectedFolder}
        onBackToFolders={() => setSelectedFolderId(null)}
        onToggle={toggleSheet}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-[10px] px-5 pb-8 pt-1"
        showsVerticalScrollIndicator={false}
      >
        {selectedFolder ? (
          <FavoritePlaceList places={selectedFolder.places} />
        ) : (
          <FavoriteFolderList
            folders={favoriteFolders}
            onFolderPress={openFolder}
          />
        )}
      </ScrollView>
    </Animated.View>
  );
}
