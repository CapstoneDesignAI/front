import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type EmblemImageSource = React.ComponentProps<typeof ExpoImage>["source"];

type EmblemImageModalProps = {
  source: EmblemImageSource;
  title: string;
  description?: string;
  detail?: string;
  visible: boolean;
  onClose: () => void;
};

export default function EmblemImageModal({
  source,
  title,
  description,
  detail,
  visible,
  onClose,
}: EmblemImageModalProps) {
  const normalizedTitle = title.replace(/\n/g, " ");

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-6">
        <Pressable
          accessibilityLabel="엠블럼 확대 보기 닫기"
          accessibilityRole="button"
          className="absolute bottom-0 left-0 right-0 top-0"
          onPress={onClose}
        />

        <View className="w-full max-w-[340px] items-center rounded-[28px] bg-white px-6 pb-6 pt-5">
          <View className="mb-4 w-full items-end">
            <Pressable
              accessibilityLabel="닫기"
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-background"
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={21} color="#4A4745" />
            </Pressable>
          </View>

          <View className="h-[260px] w-[260px] overflow-hidden rounded-[32px] bg-main-light-orange">
            <ExpoImage
              source={source}
              className="h-full w-full"
              contentFit="contain"
            />
          </View>

          <View className="mt-5 w-full items-center">
            <Text
              className="text-center text-[20px] font-black leading-6 text-gray-01"
              numberOfLines={2}
            >
              {normalizedTitle}
            </Text>
            {description ? (
              <Text className="mt-2 text-center text-[14px] leading-5 text-gray-02">
                {description}
              </Text>
            ) : null}
            {detail ? (
              <Text className="mt-3 rounded-full bg-main-light-orange px-3 py-1 text-center text-[12px] font-bold text-main-orange">
                {detail}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
