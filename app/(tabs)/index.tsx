import Button from "@/components/buttons/Button";
import KakaoButton from "@/components/buttons/KakaoButton";
import TripContext from "@/components/home/TripContext";
import { useAuthStore } from "@/store/login/useAuthStore";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { isLogin } = useAuthStore();
  const [isTripContextOpen, setIsTripContextOpen] = useState(true);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow items-center pb-[180px]"
        showsVerticalScrollIndicator={false}
      >
        <Button
          title="추천 받기"
          size="large"
          onPress={() => {
            return;
          }}
          color="gradient"
        />
        <TripContext
          isOpen={isTripContextOpen}
          onToggle={() => setIsTripContextOpen((prev) => !prev)}
        />

        <View className="flex items-center justify-center p-6">
          <View className="w-full bg-background p-6 rounded-[24px] border border-gray-04 shadow-sm">
            {isLogin ? (
              <Text className="text-main-green mt-4 font-bold">
                로그인 상태입니다.
              </Text>
            ) : (
              <Text className="text-main-blue mt-4 font-bold">
                로그아웃 상태입니다.
              </Text>
            )}
            <KakaoButton />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
