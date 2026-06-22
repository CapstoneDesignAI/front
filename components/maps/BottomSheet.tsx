import deleteBookmark from "@/api/bookmarks/deleteBookmark";
import deleteFolder from "@/api/bookmarks/deleteFolder";
import getBookmarkFolders from "@/api/bookmarks/getBookmarkFolders";
import getBookmarkedPlaces from "@/api/bookmarks/getBookmarkedPlaces";
import postBookmark from "@/api/bookmarks/postBookmark";
import postCreateFolder from "@/api/bookmarks/postCreateFolder";
import putEditFolder from "@/api/bookmarks/putEditFolder";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  PanResponder,
  ScrollView,
  Text,
  View,
} from "react-native";

import BottomSheetHeader from "./BottomSheetHeader";
import FavoriteFolderList from "./FavoriteFolderList";
import FavoritePlaceList from "./FavoritePlaceList";

const COLLAPSED_SHEET_HEIGHT = 100;
const EXPANDED_SHEET_HEIGHT = 600;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

type BottomSheetProps = {
  pendingPlace?: IKakaoPlacePayload | null;
  targetFolderId?: string | null;
  onCloseSavingMode?: () => void;
};

export default function BottomSheet({
  pendingPlace,
  targetFolderId,
  onCloseSavingMode,
}: BottomSheetProps) {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const sheetHeight = useRef(
    new Animated.Value(COLLAPSED_SHEET_HEIGHT),
  ).current;
  const currentHeightRef = useRef(COLLAPSED_SHEET_HEIGHT);
  const dragStartHeightRef = useRef(COLLAPSED_SHEET_HEIGHT);

  const isSavingMode = Boolean(pendingPlace);

  useEffect(() => {
    if (isSavingMode && targetFolderId) {
      savePlaceMutation.mutate(targetFolderId);
    }
  }, [isSavingMode, targetFolderId]);

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

  useEffect(() => {
    if (isSavingMode) {
      snapSheet(EXPANDED_SHEET_HEIGHT);
    }
  }, [isSavingMode]);

  const { data: bookmarkFolders, isLoading: isFoldersLoading } = useQuery({
    queryKey: ["BOOKMARK_FOLDERS", accessToken],
    queryFn: () => getBookmarkFolders(accessToken),
    enabled: Boolean(accessToken),
  });

  const {
    data: bookmarkedPlaces,
    isLoading: isPlacesLoading,
  } = useQuery({
    queryKey: ["BOOKMARK_PLACES", accessToken, selectedFolderId],
    queryFn: () => getBookmarkedPlaces(accessToken, selectedFolderId!),
    enabled: Boolean(accessToken && selectedFolderId),
  });

  const folders = useMemo(() => bookmarkFolders ?? [], [bookmarkFolders]);
  const places = useMemo(() => bookmarkedPlaces ?? [], [bookmarkedPlaces]);

  const invalidateFolders = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["BOOKMARK_FOLDERS", accessToken],
      }),
      queryClient.invalidateQueries({
        queryKey: ["BOOKMARKED_PLACES", accessToken],
      }),
    ]);
  };

  const invalidatePlaces = async (folderId: string) => {
    await queryClient.invalidateQueries({
      queryKey: ["BOOKMARK_PLACES", accessToken, folderId],
    });
  };

  const createFolderMutation = useMutation({
    mutationFn: (name: string) => postCreateFolder(accessToken, { name }),
    onSuccess: async () => {
      await invalidateFolders();
      Alert.alert("폴더 생성 완료");
    },
    onError: (error) => {
      Alert.alert(
        "폴더 생성 실패",
        error instanceof Error ? error.message : "폴더를 생성하지 못했습니다.",
      );
    },
  });

  const savePlaceMutation = useMutation({
    mutationFn: (folderId: string) =>
      postBookmark(accessToken, {
        place: pendingPlace!,
        folder_id: folderId,
      }),
    onSuccess: async (_, folderId) => {
      await invalidateFolders();
      await invalidatePlaces(folderId);
      const folder = folders.find((f) => f.folder_id === folderId);
      Alert.alert(
        "장소 저장 완료",
        `${pendingPlace?.name}을(를) ${folder?.name} 폴더에 저장했습니다.`,
      );
      onCloseSavingMode?.();
      snapSheet(COLLAPSED_SHEET_HEIGHT);
    },
    onError: (error) => {
      Alert.alert(
        "장소 저장 실패",
        error instanceof Error ? error.message : "장소를 저장하지 못했습니다.",
      );
    },
  });

  const editFolderMutation = useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      putEditFolder(accessToken, { name }, folderId),
    onSuccess: async () => {
      await invalidateFolders();
      Alert.alert("폴더 수정 완료");
    },
    onError: (error) => {
      Alert.alert(
        "폴더 수정 실패",
        error instanceof Error ? error.message : "폴더를 수정하지 못했습니다.",
      );
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => deleteFolder(accessToken, folderId),
    onSuccess: async () => {
      setSelectedFolderId(null);
      await invalidateFolders();
      Alert.alert("폴더 삭제 완료");
    },
    onError: (error) => {
      Alert.alert(
        "폴더 삭제 실패",
        error instanceof Error ? error.message : "폴더를 삭제하지 못했습니다.",
      );
    },
  });

  const deletePlaceMutation = useMutation({
    mutationFn: (placeId: string) => deleteBookmark(accessToken, placeId),
    onSuccess: async () => {
      if (selectedFolderId) {
        await invalidatePlaces(selectedFolderId);
      }
      await invalidateFolders();
      Alert.alert("장소 삭제 완료");
    },
    onError: (error) => {
      Alert.alert(
        "장소 삭제 실패",
        error instanceof Error ? error.message : "장소를 삭제하지 못했습니다.",
      );
    },
  });

  const selectedFolder = useMemo(() => {
    return folders.find((folder) => folder.folder_id === selectedFolderId);
  }, [folders, selectedFolderId]);

  const handleFolderPress = (folderId: string) => {
    if (isSavingMode) {
      savePlaceMutation.mutate(folderId);
    } else {
      setSelectedFolderId(folderId);
      snapSheet(EXPANDED_SHEET_HEIGHT);
    }
  };

  const requireLogin = () => {
    if (accessToken) {
      return true;
    }

    Alert.alert("로그인이 필요해요", "폴더를 관리하려면 다시 로그인해 주세요.");
    return false;
  };

  const promptFolderName = (
    title: string,
    onSubmit: (name: string) => void,
    defaultValue = "",
  ) => {
    Alert.prompt(
      title,
      "폴더 이름을 입력해 주세요.",
      (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          Alert.alert("폴더 이름을 입력해 주세요.");
          return;
        }
        onSubmit(trimmedName);
      },
      "plain-text",
      defaultValue,
    );
  };

  const handleCreateFolder = () => {
    if (!requireLogin()) {
      return;
    }

    promptFolderName("새 폴더 만들기", (name) => {
      createFolderMutation.mutate(name);
    });
  };

  const handleEditFolder = (folder: IFolderItem) => {
    if (!requireLogin()) {
      return;
    }

    promptFolderName(
      "폴더 이름 수정",
      (name) => {
        editFolderMutation.mutate({ folderId: folder.folder_id, name });
      },
      folder.name,
    );
  };

  const handleDeleteFolder = (folder: IFolderItem) => {
    if (!requireLogin()) {
      return;
    }

    Alert.alert("폴더 삭제", `"${folder.name}" 폴더를 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => deleteFolderMutation.mutate(folder.folder_id),
      },
    ]);
  };

  const handleDeletePlace = (place: IBookmarkedPlaceItem) => {
    if (!requireLogin()) {
      return;
    }

    Alert.alert("장소 삭제", `"${place.name}"을(를) 즐겨찾기에서 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => deletePlaceMutation.mutate(place.place_id),
      },
    ]);
  };

  const toggleSheet = () => {
    if (isSavingMode) {
      onCloseSavingMode?.();
      snapSheet(COLLAPSED_SHEET_HEIGHT);
    } else {
      snapSheet(
        currentHeightRef.current >
          (COLLAPSED_SHEET_HEIGHT + EXPANDED_SHEET_HEIGHT) / 2
          ? COLLAPSED_SHEET_HEIGHT
          : EXPANDED_SHEET_HEIGHT,
      );
    }
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

        if (!shouldExpand && isSavingMode) {
          onCloseSavingMode?.();
        }

        snapSheet(
          shouldExpand ? EXPANDED_SHEET_HEIGHT : COLLAPSED_SHEET_HEIGHT,
        );
      },
    }),
  ).current;

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-background pb-[18px] shadow-xl border border-gray-04"
      style={{ height: sheetHeight }}
    >
      <View
        {...panResponder.panHandlers}
        className="items-center pb-2 pt-[10px]"
      >
        <View className="h-1 w-[42px] rounded-full bg-main-green" />
      </View>
      <BottomSheetHeader
        folderCount={folders.length}
        isExpanded={isExpanded}
        selectedFolder={selectedFolder}
        onBackToFolders={() => setSelectedFolderId(null)}
        onCreateFolder={handleCreateFolder}
        onToggle={toggleSheet}
        onDeletePress={handleDeleteFolder}
        onEditPress={handleEditFolder}
        isSavingMode={isSavingMode}
        pendingPlaceName={pendingPlace?.name}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-[10px] px-5 pb-8 pt-1"
        showsVerticalScrollIndicator={false}
      >
        {!accessToken ? (
          <Text className="px-1 py-4 text-center text-[13px] text-gray-02">
            로그인 후 즐겨찾기 폴더를 확인할 수 있어요.
          </Text>
        ) : isFoldersLoading ? (
          <Text className="px-1 py-4 text-center text-[13px] text-gray-02">
            폴더를 불러오는 중이에요.
          </Text>
        ) : selectedFolder && isPlacesLoading ? (
          <Text className="px-1 py-4 text-center text-[13px] text-gray-02">
            저장한 장소를 불러오는 중이에요.
          </Text>
        ) : selectedFolder && places.length === 0 ? (
          <Text className="px-1 py-4 text-center text-[13px] text-gray-02">
            아직 저장한 장소가 없어요.
          </Text>
        ) : selectedFolder ? (
          <FavoritePlaceList
            places={places}
            onDeletePlace={handleDeletePlace}
          />
        ) : (
          <FavoriteFolderList
            folders={folders}
            onDeleteFolder={handleDeleteFolder}
            onEditFolder={handleEditFolder}
            onFolderPress={handleFolderPress}
          />
        )}
      </ScrollView>
    </Animated.View>
  );
}
