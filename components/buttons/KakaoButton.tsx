import getKakaoURL from "@/app/api/login/getKaKaoLogin";
import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Pressable, Text } from "react-native";

const KakaoButton = () => {
  const { data: KAKAO_AUTH_URL } = useQuery({
    queryKey: ["KAKAO_URL"],
    queryFn: () => getKakaoURL(),
  });

  const handlePressIn = async () => {
    if (KAKAO_AUTH_URL?.authorization_url) {
      await WebBrowser.openBrowserAsync(KAKAO_AUTH_URL.authorization_url);
    } else {
      Alert.alert("카카오 로그인 URL을 불러오는 데 실패했습니다.");
    }
  };

  return (
    <Pressable
      className={`mt-6 w-[300px] h-[52px] bg-[#FFE812] items-center justify-center rounded-[10px]`}
      onPressIn={handlePressIn}
    >
      <Text className={`font-bold text-[15px] text-[#381F1F]`}>
        카카오톡으로 로그인
      </Text>
    </Pressable>
  );
};

export default KakaoButton;
