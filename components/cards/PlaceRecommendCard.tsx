import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

import Button from "../buttons/Button";
import Tag from "@/components/cards/Tag";

export default function PlaceRecommendCard() {
  return (
    <View className="bg-white shadow-sm rounded-[20px] w-[360px] h-fit p-[20px] gap-[12px] items-center">
      <Image
        source={require("@/assets/images/example_place.png")}
        className="w-[320px] h-[165px] rounded-[10px]"
        resizeMode="cover"
      />
      <View className="gap-[6px] items-start w-full">
        <Text className="text-gray-01 text-[24px] font-bold">
          모토모토 MotoMoto
        </Text>
        <View className="flex-row items-center gap-[4px]">
          <MaterialCommunityIcons name="map-marker" size={20} color="#FF7548" />
          <Text className="text-gray-01 text-[20px]">200m</Text>
          <View className="flex-row gap-2">
            <Tag title="감성" isActivated={true} />
            <Tag title="조용한" isActivated={false} />
          </View>
        </View>
        <View className="flex-row items-center gap-[4px]">
          <Text className="text-gray-01 text-[15px]">
            이 장소를 방문한 사람
          </Text>
          <MaterialCommunityIcons name="thumb-up" size={15} color="#FF7548" />
          <Text className="text-gray-02 text-[15px]">20/30</Text>
        </View>
        <Text className="text-gray-02 text-[12px]">춘천 3층짜리 대형 카페</Text>
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
