import getKakaoURL from "@/api/login/getKaKaoLogin";
import { useKakaoLoginLink } from "@/hooks/use-kakao-login-link";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Pressable, Text } from "react-native";

const KakaoButton = () => {
  const handleKakaoLoginLink = useKakaoLoginLink();
  const { data: KAKAO_AUTH_URL } = useQuery({
    queryKey: ["KAKAO_URL"],
    queryFn: () => getKakaoURL(),
  });

  const handlePressIn = async () => {
    if (KAKAO_AUTH_URL?.authorization_url) {
      const redirectUrl = Linking.createURL("login/success");
      console.log("Kakao redirect URL:", redirectUrl);

      const result = await WebBrowser.openAuthSessionAsync(
        KAKAO_AUTH_URL.authorization_url,
        redirectUrl,
      );

      if (result.type === "success") {
        handleKakaoLoginLink(result.url);
      }
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
