import getKakaoURL from "@/api/login/getKaKaoLogin";
import { useKakaoLoginLink } from "@/hooks/use-kakao-login-link";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Pressable, Text } from "react-native";

const KakaoButton = () => {
  const handleKakaoLoginLink = useKakaoLoginLink();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => getKakaoURL(),
  });

  const handlePress = async () => {
    try {
      const kakaoAuthUrl = await mutateAsync();

      if (!kakaoAuthUrl.authorization_url) {
        Alert.alert("카카오 로그인 URL을 불러오는 데 실패했습니다.");
        return;
      }

      const redirectUrl = Linking.createURL("login/success");
      console.log("Kakao redirect URL:", redirectUrl);

      const result = await WebBrowser.openAuthSessionAsync(
        kakaoAuthUrl.authorization_url,
        redirectUrl,
      );

      if (result.type === "success") {
        handleKakaoLoginLink(result.url);
      }
    } catch {
      Alert.alert("카카오 로그인 URL을 불러오는 데 실패했습니다.");
    }
  };

  return (
    <Pressable
      className={`mt-6 h-[52px] w-[300px] items-center justify-center rounded-[10px] bg-[#FFE812] ${
        isPending ? "opacity-70" : ""
      }`}
      disabled={isPending}
      onPress={handlePress}
    >
      <Text className={`font-bold text-[15px] text-[#381F1F]`}>
        {isPending ? "로그인 준비 중" : "카카오톡으로 로그인"}
      </Text>
    </Pressable>
  );
};

export default KakaoButton;
