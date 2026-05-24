import Button from "@/components/buttons/Button";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

type StepKey =
  | "region"
  | "duration"
  | "transportation"
  | "theme"
  | "mood"
  | "activityStyle"
  | "purpose"
  | "companion";

type Step = {
  key: StepKey;
  title: string;
  description: string;
  optional?: boolean;
  options: string[];
};

const steps: Step[] = [
  {
    key: "region",
    title: "여행 지역",
    description: "도 기준으로 선택해 주세요. 정하지 않았다면 상관없음을 눌러도 괜찮아요.",
    optional: true,
    options: [
      "상관없음",
      "서울특별시",
      "경기도",
      "강원도",
      "충청도",
      "전라도",
      "경상도",
      "제주도",
    ],
  },
  {
    key: "duration",
    title: "여행 시간",
    description: "오늘 여행에 쓸 수 있는 시간을 알려주세요.",
    options: ["1-2시간", "반나절", "하루", "1박 2일", "2박 이상"],
  },
  {
    key: "transportation",
    title: "이동 수단",
    description: "추천 동선이 현실적으로 이어지도록 이동 방식을 선택해 주세요.",
    options: ["도보", "대중교통", "자가용", "택시", "상관없음"],
  },
  {
    key: "theme",
    title: "여행 테마",
    description: "이번 여행에서 가장 끌리는 테마를 골라주세요.",
    options: ["맛집", "카페", "자연", "문화/전시", "쇼핑", "로컬 탐방"],
  },
  {
    key: "mood",
    title: "선호 분위기",
    description: "장소의 공기감은 어떤 쪽이 좋나요?",
    options: ["감성적인", "조용한", "활기찬", "힙한", "여유로운", "로컬 느낌"],
  },
  {
    key: "activityStyle",
    title: "활동 스타일",
    description: "몸을 많이 움직이는 일정과 쉬어가는 일정 중 어디에 가까운가요?",
    options: ["휴식 중심", "가볍게 걷기", "액티비티 중심", "사진 많이", "맛집 중심"],
  },
  {
    key: "purpose",
    title: "여행 목적",
    description: "이번 여행에서 얻고 싶은 것을 골라주세요.",
    options: ["힐링", "기념일", "새로운 경험", "데이트", "친목", "혼자만의 시간"],
  },
  {
    key: "companion",
    title: "동행자",
    description: "누구와 함께 떠나나요?",
    options: ["혼자", "친구", "연인", "가족", "동료", "아이와 함께"],
  },
];

export default function CustomTripScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<StepKey, string>>>({});

  const currentStep = steps[currentStepIndex];
  const selectedAnswer = answers[currentStep.key];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const completedCount = useMemo(() => {
    return steps.filter((step) => answers[step.key]).length;
  }, [answers]);

  const selectAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep.key]: answer,
    }));
  };

  const goNext = () => {
    if (!selectedAnswer && !currentStep.optional) {
      return;
    }

    const nextAnswers = {
      ...answers,
      [currentStep.key]: selectedAnswer ?? "상관없음",
    };

    if (!selectedAnswer && currentStep.optional) {
      setAnswers(nextAnswers);
    }

    if (isLastStep) {
      const summary = steps
        .map((step) => `${step.title}: ${nextAnswers[step.key] ?? "상관없음"}`)
        .join("\n");

      Alert.alert("입력 완료", summary);
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const goBack = () => {
    if (isFirstStep) {
      router.back();
      return;
    }

    setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6 pb-10 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] font-bold text-main-green">
              {currentStepIndex + 1} / {steps.length}
            </Text>
            <Text className="text-[13px] font-medium text-gray-03">
              {completedCount}개 입력 완료
            </Text>
          </View>
          <View className="flex-row gap-1.5">
            {steps.map((step, index) => (
              <View
                key={step.key}
                className={`h-2 flex-1 rounded-full ${
                  index <= currentStepIndex ? "bg-main-green" : "bg-gray-04"
                }`}
              />
            ))}
          </View>
        </View>

        <View className="flex-1 gap-7">
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-[28px] font-black text-gray-01">
                {currentStep.title}
              </Text>
              {currentStep.optional ? (
                <Text className="rounded-full bg-main-light-orange px-2 py-1 text-[12px] font-bold text-gray-02">
                  선택
                </Text>
              ) : null}
            </View>
            <Text className="text-[15px] leading-6 text-gray-02">
              {currentStep.description}
            </Text>
          </View>

          <View className="gap-3">
            {currentStep.options.map((option) => {
              const isSelected = selectedAnswer === option;

              return (
                <Pressable
                  key={option}
                  className={`min-h-[54px] justify-center rounded-[18px] border px-5 ${
                    isSelected
                      ? "border-main-green bg-main-light-orange"
                      : "border-gray-04 bg-background"
                  }`}
                  onPress={() => selectAnswer(option)}
                >
                  <Text
                    className={`text-[16px] ${
                      isSelected
                        ? "font-bold text-gray-01"
                        : "font-medium text-gray-02"
                    }`}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-8 flex-row items-center justify-between gap-3">
          <Pressable
            className="h-[52px] flex-1 items-center justify-center rounded-[16px] border border-gray-04 bg-background"
            onPress={goBack}
          >
            <Text className="text-[16px] font-bold text-gray-02">
              {isFirstStep ? "닫기" : "이전"}
            </Text>
          </Pressable>
          <Button
            title={isLastStep ? "추천 받기" : "다음"}
            size="small"
            color={selectedAnswer || currentStep.optional ? "gradient" : "disabled"}
            onPress={goNext}
          />
        </View>
      </ScrollView>
    </View>
  );
}
