import getMissionDetailItem from "@/api/missions/getMissionDetailItem";
import postMissionVerify from "@/api/missions/postMissionVerify";
import { useCurrentLocation } from "@/hooks/use-current-location";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

cssInterop(ExpoImage, {
  className: "style",
});

export default function MissionVerificationScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { missionId } = useLocalSearchParams<{
    missionId?: string;
  }>();
  const { coords, errorMessage, isLoading, refresh } = useCurrentLocation();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const { data: missionDetail } = useQuery({
    queryKey: ["MISSION_DETAIL", missionId, accessToken],
    queryFn: () => getMissionDetailItem(accessToken, missionId ?? ""),
    enabled: Boolean(accessToken && missionId),
    retry: false,
  });

  const verifyMutation = useMutation({
    mutationFn: () => {
      if (!accessToken || !missionId || !coords) {
        throw new Error("미션 인증에 필요한 정보가 부족합니다.");
      }

      console.log(
        missionId,
        coords.latitude,
        coords.longitude,
        selectedImageUri,
      );

      return postMissionVerify(accessToken, missionId, {
        mission_id: missionId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        image_url: selectedImageUri,
      });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["MISSIONS"] });
      await queryClient.invalidateQueries({ queryKey: ["MISSION_DETAIL"] });
      await queryClient.invalidateQueries({ queryKey: ["STAMPS"] });
      await queryClient.invalidateQueries({ queryKey: ["EMBLEMS"] });
      Alert.alert("미션 인증 완료", response.message);
    },
    onError: (error) => {
      Alert.alert(
        "미션 인증 실패",
        error instanceof Error ? error.message : "다시 시도해 주세요.",
      );
    },
  });

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "사진 접근 권한이 필요해요",
        "미션 인증 사진을 업로드하려면 앨범 접근을 허용해 주세요.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const imageUri = result.assets[0]?.uri;

    if (!imageUri) {
      Alert.alert("사진을 불러오지 못했어요", "다시 선택해 주세요.");
      return;
    }

    setSelectedImageUri(imageUri);
  };

  const handleSubmitVerification = () => {
    if (!selectedImageUri) {
      Alert.alert("사진이 필요해요", "미션 인증 사진을 먼저 업로드해 주세요.");
      return;
    }

    if (!coords) {
      Alert.alert("위치 인증이 필요해요", "현재 위치를 먼저 확인해 주세요.");
      return;
    }

    verifyMutation.mutate();
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-10 pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-[28px] font-black text-gray-01">미션 인증</Text>
          <Text className="text-[15px] leading-6 text-gray-02">
            {missionDetail?.title
              ? `${missionDetail.title} 인증을 진행해 주세요.`
              : "위치 확인 후 사진을 업로드해주세요."}
          </Text>
        </View>

        <View className="gap-4 rounded-[18px] bg-white px-5 py-5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-main-orange">
              <Text className="text-[18px] font-bold text-white">1</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[20px] font-bold text-gray-01">
                위치 인증
              </Text>
              <Text className="mt-1 text-[14px] leading-5 text-gray-02">
                {missionDetail?.distance_text ??
                  "미션 장소 반경 300m 안에서 인증"}
              </Text>
              {errorMessage ? (
                <Text className="mt-1 text-[12px] text-main-orange">
                  {errorMessage}
                </Text>
              ) : null}
            </View>
          </View>

          <Pressable
            className="h-[46px] items-center justify-center rounded-[16px] bg-main-light-orange"
            onPress={refresh}
          >
            <Text className="text-[15px] font-bold text-main-orange">
              {isLoading ? "확인 중" : coords ? "위치 확인 완료" : "확인하기"}
            </Text>
          </Pressable>
        </View>

        <View className="gap-5 rounded-[18px] bg-white px-5 py-5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-main-blue">
              <Text className="text-[18px] font-bold text-white">2</Text>
            </View>
            <Text className="text-[20px] font-bold text-gray-01">
              사진 업로드
            </Text>
          </View>

          <Pressable
            className="h-[180px] items-center justify-center overflow-hidden rounded-[18px] border border-gray-04 bg-[#F0F0F0]"
            onPress={handlePickImage}
          >
            {selectedImageUri ? (
              <>
                <ExpoImage
                  source={{ uri: selectedImageUri }}
                  className="absolute inset-0 h-full w-full"
                  contentFit="cover"
                />
                <View className="absolute bottom-3 rounded-full bg-black/50 px-3 py-1.5">
                  <Text className="text-[12px] font-bold text-white">
                    사진 변경
                  </Text>
                </View>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={36}
                  color="#A59A93"
                />
                <Text className="mt-3 text-[15px] font-medium text-gray-02">
                  사진을 추가해주세요
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <Pressable
          className={`h-[52px] items-center justify-center rounded-[16px] ${
            selectedImageUri && coords ? "bg-main-orange" : "bg-gray-04"
          }`}
          onPress={handleSubmitVerification}
          disabled={verifyMutation.isPending}
        >
          <Text
            className={`text-[17px] font-bold ${
              selectedImageUri && coords ? "text-white" : "text-gray-02"
            }`}
          >
            {verifyMutation.isPending ? "인증 중" : "인증 제출하기"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
