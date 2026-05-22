import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import Tag from "@/components/cards/Tag";
import Button from "../buttons/Button";

const routeStops = [
  {
    id: 1,
    name: "모토모토 MotoMoto",
    type: "카페",
    duration: "40분",
  },
  {
    id: 2,
    name: "소양강 스카이워크",
    type: "관광",
    duration: "35분",
  },
  {
    id: 3,
    name: "육림고개",
    type: "맛집",
    duration: "50분",
  },
];

export default function RouteRecommendCard() {
  return (
    <View className="h-fit w-[360px] items-center gap-[14px] rounded-[20px] bg-white p-[20px] shadow-sm">
      <View className="w-full gap-[8px]">
        <View className="flex-row items-center justify-between">
          <Text className="text-[24px] font-bold text-gray-01">
            감성 산책 동선
          </Text>
          <MaterialCommunityIcons name="routes" size={30} color="#FF7548" />
        </View>
        <View className="flex-row items-center gap-[4px]">
          <MaterialCommunityIcons name="clock-outline" size={20} color="#FF7548" />
          <Text className="text-[20px] text-gray-01">2시간 5분</Text>
          <View className="flex-row gap-2">
            <Tag title="감성" isActivated={true} />
            <Tag title="도보" isActivated={false} />
          </View>
        </View>
        <View className="flex-row items-center gap-[4px]">
          <Text className="text-[15px] text-gray-01">이 동선을 추천받은 사람</Text>
          <MaterialCommunityIcons name="thumb-up" size={15} color="#FF7548" />
          <Text className="text-[15px] text-gray-02">18/30</Text>
        </View>
        <Text className="text-[12px] text-gray-02">
          카페에서 시작해서 산책과 맛집까지 이어지는 춘천 반나절 코스
        </Text>
      </View>

      <View className="w-full gap-[10px] rounded-[14px] bg-main-05 p-[14px]">
        {routeStops.map((stop, index) => {
          const isLast = index === routeStops.length - 1;

          return (
            <View key={stop.id} className="flex-row gap-[10px]">
              <View className="items-center">
                <View className="h-[24px] w-[24px] items-center justify-center rounded-full bg-main-01">
                  <Text className="text-[12px] font-bold text-white">
                    {index + 1}
                  </Text>
                </View>
                {!isLast ? <View className="h-[34px] w-[2px] bg-main-03" /> : null}
              </View>
              <View className="flex-1 pb-[8px]">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="flex-1 text-[15px] font-bold text-gray-01"
                    numberOfLines={1}
                  >
                    {stop.name}
                  </Text>
                  <Text className="ml-2 text-[12px] font-bold text-main-01">
                    {stop.duration}
                  </Text>
                </View>
                <Text className="mt-[2px] text-[12px] text-gray-02">
                  {stop.type}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View className="flex-row items-center">
        <Button
          title="별로예요"
          size="small"
          color="disabled"
          onPress={() => {
            return;
          }}
        />
        <MaterialCommunityIcons
          name="bookmark-outline"
          size={30}
          color="#A7A5A4"
        />
      </View>
    </View>
  );
}
