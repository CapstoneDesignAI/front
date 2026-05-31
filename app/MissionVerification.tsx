import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

cssInterop(ExpoImage, {
  className: "style",
});

export default function MissionVerificationScreen() {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

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

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-10 pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-[28px] font-black text-gray-01">
            미션 인증
          </Text>
          <Text className="text-[15px] leading-6 text-gray-02">
            위치 확인 후 사진을 업로드해주세요.
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
                미션 장소 반경 300m 안에서 인증
              </Text>
            </View>
          </View>

          <Pressable className="h-[46px] items-center justify-center rounded-[16px] bg-main-light-orange">
            <Text className="text-[15px] font-bold text-main-orange">
              확인하기
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
      </View>
    </ScrollView>
  );
}
