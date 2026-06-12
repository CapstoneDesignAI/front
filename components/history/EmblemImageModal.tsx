import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type EmblemImageSource = React.ComponentProps<typeof ExpoImage>["source"];

type EmblemImageModalProps = {
  source: EmblemImageSource;
  title: string;
  visible: boolean;
  onClose: () => void;
};

export default function EmblemImageModal({
  source,
  title,
  visible,
  onClose,
}: EmblemImageModalProps) {
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
          <View className="mb-4 w-full flex-row items-center justify-between">
            <Text
              className="min-w-0 flex-1 pr-3 text-[18px] font-black text-gray-01"
              numberOfLines={1}
            >
              {title}
            </Text>
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
        </View>
      </View>
    </Modal>
  );
}
