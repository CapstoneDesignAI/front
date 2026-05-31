import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";

type MyProfileCardProps = {
  nickname: string;
  profileImageUri?: string | null;
  isLoading?: boolean;
  onEditPress?: () => void;
};

const DEFAULT_PROFILE_IMAGE = require("@/assets/images/icon.png");

cssInterop(ExpoImage, {
  className: "style",
});

export default function MyProfileCard({
  nickname,
  profileImageUri,
  isLoading = false,
  onEditPress,
}: MyProfileCardProps) {
  return (
    <View className="flex-row items-center rounded-[20px] bg-white px-5 py-7">
      <ExpoImage
        source={
          profileImageUri ? { uri: profileImageUri } : DEFAULT_PROFILE_IMAGE
        }
        className="h-[76px] w-[76px] rounded-full"
        contentFit="cover"
      />

      <View className="ml-5 min-w-0 flex-1 gap-3">
        <View className="flex-row items-center gap-2">
          <Text
            className="text-[20px] font-bold text-gray-01"
            numberOfLines={1}
          >
            {nickname}
          </Text>
          <Text className="text-[12px] text-gray-03">카카오 연동</Text>
        </View>

        <Pressable
          className="h-[30px] w-[92px] items-center justify-center rounded-full bg-main-light-orange"
          disabled={isLoading}
          onPress={onEditPress}
        >
          <Text className="text-[12px] font-bold text-main-orange">
            프로필 편집
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
