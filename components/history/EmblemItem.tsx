import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import EmblemImageModal from "./EmblemImageModal";

type EmblemType = "traveler" | "explorer" | "master";
type RegionType = "Danyang" | "Hwacheon";

type EmblemItemProps = {
  type?: EmblemType;
  region?: RegionType;
  title?: string;
  imageUrl?: string | null;
  label?: string;
  completedMissionCount?: number;
  acquiredDate?: string;
  buttonTitle?: string;
  onSharePress?: () => void;
};

const REGIONAL_EMBLEMS = {
  Danyang: {
    traveler: {
      title: "단양 초보 탐험가",
      image: require("@/assets/svg/Danyang/Traveler.png"),
    },
    explorer: {
      title: "단양 프로 탐험가",
      image: require("@/assets/svg/Danyang/Explorer.png"),
    },
    master: {
      title: "단양 마스터",
      image: require("@/assets/svg/Danyang/Master.png"),
    },
  },
  Hwacheon: {
    traveler: {
      title: "화천 초보 탐험가",
      image: require("@/assets/svg/Hwacheon/Traveler.png"),
    },
    explorer: {
      title: "화천 프로 탐험가",
      image: require("@/assets/svg/Hwacheon/Explorer.png"),
    },
    master: {
      title: "화천 마스터",
      image: require("@/assets/svg/Hwacheon/Master.png"),
    },
  },
} as const;

export default function EmblemItem({
  type: providedType,
  region: providedRegion,
  title,
  imageUrl,
  completedMissionCount = 5,
  acquiredDate = "2026.05.30",
  buttonTitle = "공유하기",
  onSharePress,
}: EmblemItemProps) {
  // title을 기반으로 지역과 타입을 추론합니다
  const inferRegionAndType = () => {
    let region: RegionType = providedRegion ?? "Danyang";
    let type: EmblemType = providedType ?? "explorer";
    let isMatched = false;

    if (title) {
      if (title.includes("화천")) {
        region = "Hwacheon";
        isMatched = true;
      } else if (title.includes("단양")) {
        region = "Danyang";
        isMatched = true;
      }

      if (title.includes("초보") || title.includes("여행자")) {
        type = "traveler";
        isMatched = true;
      } else if (title.includes("프로") || title.includes("탐험가")) {
        type = "explorer";
        isMatched = true;
      } else if (title.includes("마스터")) {
        type = "master";
        isMatched = true;
      }
    }

    return { region, type, isMatched };
  };

  const { region, type, isMatched } = inferRegionAndType();
  const emblem = REGIONAL_EMBLEMS[region][type];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const resolvedTitle = title ?? emblem.title;
  
  // 이름이 매치되면 로컬 이미지를 우선적으로 사용하고, 아니면 전달받은 imageUrl을 사용합니다.
  const source = isMatched ? emblem.image : (imageUrl ? { uri: imageUrl } : emblem.image);

  return (
    <>
      <Pressable
        accessibilityLabel={`${resolvedTitle} 엠블럼 크게 보기`}
        accessibilityRole="button"
        className="w-full flex-row items-center gap-4 rounded-[22px] bg-white p-4"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="h-[86px] w-[86px] overflow-hidden rounded-[24px] bg-main-light-orange">
          <ExpoImage
            source={source}
            className="h-full w-full"
            contentFit="cover"
          />
        </View>

        <View className="min-w-0 flex-1 gap-2">
          <View className="gap-1">
            <Text
              className="text-[22px] font-black leading-7 text-gray-01"
              numberOfLines={1}
            >
              {resolvedTitle}
            </Text>
            <Text
              className="text-[14px] leading-5 text-gray-02"
              numberOfLines={1}
            >
              완료 미션 {completedMissionCount}개 · {acquiredDate} 획득
            </Text>
          </View>

          {/* <Pressable
          className="h-[36px] w-[112px] items-center justify-center rounded-full bg-[#FFEBE0]"
          onPress={onSharePress}
        >
          <Text className="text-[14px] font-bold text-main-orange">
            {buttonTitle}
          </Text>
        </Pressable> */}
        </View>
      </Pressable>

      <EmblemImageModal
        source={source}
        title={resolvedTitle}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}
