import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

type MissionItemProps = {
  title?: string;
  rewardText?: string;
  difficulty?: string;
  buttonTitle?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
};

export default function MissionItem({
  title = "로컬 시장에서 간식 먹기",
  rewardText = "사진 업로드 · 스탬프 1개",
  difficulty = "쉬움",
  buttonTitle = "인증",
  imageSource,
  onPress,
}: MissionItemProps) {
  return (
    <View className="relative h-[116px] w-[327px] rounded-[18px] bg-white">
      <View className="absolute left-[16px] top-[16px] h-[76px] w-[76px] overflow-hidden rounded-[14px] bg-[#F0F0F0]">
        {imageSource ? (
          <Image
            source={imageSource}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : null}
      </View>

      <Text
        className="absolute left-[108px] top-[18px] w-[194px] text-[22px] font-bold leading-[28px] text-[#1F1F1F]"
        numberOfLines={1}
      >
        {title}
      </Text>

      <Text
        className="absolute left-[108px] top-[47px] w-[194px] text-[16px] leading-[22px] text-[#737373]"
        numberOfLines={1}
      >
        {rewardText}
      </Text>

      <Text className="absolute left-[108px] top-[70px] text-[16px] leading-[22px] text-[#8FA87A]">
        {difficulty}
      </Text>

      <Pressable
        className="absolute left-[228px] top-[72px] h-[28px] w-[72px] items-center justify-center rounded-full bg-[#FFEBE0]"
        onPress={onPress}
      >
        <Text className="text-[15px] font-bold leading-[19px] text-[#F28569]">
          {buttonTitle}
        </Text>
      </Pressable>
    </View>
  );
}
