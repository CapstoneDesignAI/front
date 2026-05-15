import React from "react";
import { Alert, Pressable, Text } from "react-native";

const KakaoButton = () => {
  const handlePressIn = () => {
    // 카카오톡 로그인 로직을 여기에 구현하세요.
    Alert.alert("카카오톡 로그인 버튼이 눌렸습니다.");
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
