import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import EmblemImageModal from "./EmblemImageModal";

type SmallEmblemType = "traveler" | "explorer" | "master";
type RegionType = "Danyang" | "Hwacheon";

type SmallEmblemItemProps = {
  type?: SmallEmblemType;
  region?: RegionType;
  title?: string;
  subtitle?: string;
  status?: string;
  isLocked?: boolean;
  imageUrl?: string | null;
};

const REGIONAL_EMBLEMS = {
  Danyang: {
    traveler: {
      title: "단양 초보\n탐험가",
      image: require("@/assets/svg/Danyang/Traveler.png"),
    },
    explorer: {
      title: "단양 프로\n탐험가",
      image: require("@/assets/svg/Danyang/Explorer.png"),
    },
    master: {
      title: "단양\n마스터",
      image: require("@/assets/svg/Danyang/Master.png"),
    },
  },
  Hwacheon: {
    traveler: {
      title: "화천 초보\n탐험가",
      image: require("@/assets/svg/Hwacheon/Traveler.png"),
    },
    explorer: {
      title: "화천 프로\n탐험가",
      image: require("@/assets/svg/Hwacheon/Explorer.png"),
    },
    master: {
      title: "화천\n마스터",
      image: require("@/assets/svg/Hwacheon/Master.png"),
    },
  },
} as const;

export default function SmallEmblemItem({
  type: providedType,
  region: providedRegion,
  title,
  subtitle,
  status = "획득 완료",
  isLocked = false,
  imageUrl,
}: SmallEmblemItemProps) {
  // title이나 subtitle을 기반으로 지역과 타입을 추론합니다
  const inferRegionAndType = () => {
    let region: RegionType = providedRegion ?? "Danyang";
    let type: SmallEmblemType = providedType ?? "explorer";
    let isMatched = false;
    const text = title ?? subtitle;

    if (text) {
      if (text.includes("화천")) {
        region = "Hwacheon";
        isMatched = true;
      } else if (text.includes("단양")) {
        region = "Danyang";
        isMatched = true;
      }

      if (text.includes("초보") || text.includes("여행자")) {
        type = "traveler";
        isMatched = true;
      } else if (text.includes("프로") || text.includes("탐험가")) {
        type = "explorer";
        isMatched = true;
      } else if (text.includes("마스터")) {
        type = "master";
        isMatched = true;
      }
    }

    return { region, type, isMatched };
  };

  const { region, type, isMatched } = inferRegionAndType();
  const emblem = REGIONAL_EMBLEMS[region][type];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const resolvedTitle = title ?? subtitle ?? emblem.title;
  
  // 이름이 매치되면 로컬 이미지를 우선적으로 사용하고, 아니면 전달받은 imageUrl을 사용합니다.
  const source = isMatched ? emblem.image : (imageUrl ? { uri: imageUrl } : emblem.image);

  return (
    <>
      <Pressable
        accessibilityLabel={
          isLocked ? resolvedTitle : `${resolvedTitle} 엠블럼 크게 보기`
        }
        accessibilityRole="button"
        className="h-[144px] w-[150px] items-center rounded-[12px] bg-white px-4 pt-[18px]"
        disabled={isLocked}
        onPress={() => setIsModalVisible(true)}
      >
        <View
          className={`h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full ${
            isLocked ? "bg-[#F0F0F0]" : "bg-main-light-orange"
          }`}
          style={{
            borderColor: isLocked ? "#D9D9D9" : "#E0D6C2",
            borderWidth: 1,
          }}
        >
          {isLocked ? (
            <MaterialCommunityIcons name="help" size={22} color="#8C8C8C" />
          ) : (
            <ExpoImage
              source={source}
              className="h-full w-full"
              contentFit="cover"
            />
          )}
        </View>

        <Text
          className="mt-[10px] text-center text-[14px] font-bold leading-[17px] text-gray-01"
          numberOfLines={2}
        >
          {resolvedTitle}
        </Text>

        <Text className="mt-[2px] text-center text-[10px] leading-[13px] text-gray-03">
          {status}
        </Text>
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
