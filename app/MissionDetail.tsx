import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function MissionDetailScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-10 pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="h-[220px] items-center justify-center rounded-[24px] bg-[#F0F0F0]">
          <MaterialCommunityIcons
            name="image-outline"
            size={42}
            color="#A59A93"
          />
          <Text className="mt-2 text-[15px] font-medium text-gray-03">
            사진 영역
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-[28px] font-black text-gray-01">
            로컬 시장에서 간식 먹기
          </Text>
          <Text className="text-[15px] leading-6 text-gray-02">
            고성 전통시장에서 지역 간식을 먹고 사진으로 인증해보세요.
          </Text>
        </View>

        <View className="gap-4 rounded-[18px] border border-gray-04 bg-white px-5 py-5">
          <Text className="text-[20px] font-bold text-gray-01">
            미션 조건
          </Text>
          {[
            "고성 전통시장 근처에서 진행",
            "간식과 장소가 함께 보이는 사진 업로드",
            "인증 완료 시 스탬프 1개 획득",
          ].map((condition) => (
            <View key={condition} className="flex-row gap-2">
              <Text className="text-[15px] leading-6 text-main-green">•</Text>
              <Text className="flex-1 text-[15px] leading-6 text-gray-02">
                {condition}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          className="h-[52px] items-center justify-center rounded-[16px] bg-main-orange"
          onPress={() => router.push("/MissionVerification")}
        >
          <Text className="text-[17px] font-bold text-white">
            미션 시작하기
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
