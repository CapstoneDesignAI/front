import postAIRecommendation from "@/api/ai/postAIRecommendation";
import Button from "@/components/buttons/Button";
import RecommendCard from "@/components/cards/RecommendCard";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type StepKey =
  | "duration"
  | "transportation"
  | "travel_purpose"
  | "companion"
  | "atmosphere"
  | "activity_style"
  | "region";

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
    description:
      "도 기준으로 선택해 주세요. 정하지 않았다면 넘어가도 괜찮아요.",
    optional: true,
    options: [
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
    options: ["1~2시간", "반나절", "하루", "1박2일", "2박3일", "기타"],
  },
  {
    key: "travel_purpose",
    title: "여행 목적",
    description: "이번 여행에서 얻고 싶은 것을 골라주세요.",
    options: [
      "힐링",
      "데이트",
      "인스타감성",
      "자연/풍경",
      "현지경험",
      "역사/문화",
    ],
  },
  {
    key: "companion",
    title: "동행자",
    description: "누구와 함께 떠나나요?",
    options: [
      "혼자",
      "친구",
      "연인",
      "가족",
      "부모님",
      "아이와 함께",
      "반려동물과 함께",
      "동아리/단체",
    ],
  },
  {
    key: "transportation",
    title: "이동 수단",
    description: "추천 동선이 현실적으로 이어지도록 이동 방식을 선택해 주세요.",
    options: ["대중교통", "자차", "자전거", "도보"],
  },
  {
    key: "atmosphere",
    title: "선호 분위기",
    description: "장소의 공기감은 어떤 쪽이 좋나요?",
    optional: true,
    options: ["조용한", "감성적인", "활기찬", "로컬 느낌", "힙한 분위기"],
  },
  {
    key: "activity_style",
    title: "활동 스타일",
    description:
      "몸을 많이 움직이는 일정과 쉬어가는 일정 중 어디에 가까운가요?",
    optional: true,
    options: ["액티비티/활동적", "정적/잔잔함"],
  },
];

const normalizeOptionalAnswer = (answer?: string) => {
  if (!answer || answer === "상관없음") {
    return null;
  }

  return answer;
};

const buildAIRecommendationRequest = (
  answers: Partial<Record<StepKey, string>>,
): IPostAIRecommendationRequest => {
  return {
    duration: (answers.duration ?? "반나절") as AIRecommendationDuration,
    transportation: (answers.transportation ??
      "대중교통") as AIRecommendationTransportation,
    travel_purpose: (answers.travel_purpose ??
      "힐링") as AIRecommendationTravelPurpose,
    companion: (answers.companion ?? "혼자") as AIRecommendationCompanion,
    atmosphere: normalizeOptionalAnswer(
      answers.atmosphere,
    ) as AIRecommendationAtmosphere | null,
    activity_style: normalizeOptionalAnswer(
      answers.activity_style,
    ) as AIRecommendationActivityStyle | null,
    region: normalizeOptionalAnswer(answers.region),
  };
};

export default function CustomTripScreen() {
  const { accessToken } = useAuthStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<StepKey, string>>>({});
  const [AIrequest, setAIRequest] = useState<IPostAIRecommendationRequest>();
  const [recommendation, setRecommendation] =
    useState<IPostAIRecommendationResponse | null>(null);

  const currentStep = steps[currentStepIndex];
  const selectedAnswer = answers[currentStep.key];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const completedCount = useMemo(() => {
    return steps.filter((step) => answers[step.key]).length;
  }, [answers]);

  const queryClient = useQueryClient();

  const { mutate: AIRecommendation, isPending: isRecommendationPending } =
    useMutation({
      mutationFn: async (data: IPostAIRecommendationRequest) => {
        const response = await postAIRecommendation(accessToken, data);
        return response;
      },
      onSuccess: async (response) => {
        setRecommendation(response);
        await queryClient.invalidateQueries({
          queryKey: ["AI_RECOMMENDATION"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["TODAY_RECOMMENDATION"],
        });
      },
      onError: (error) => {
        console.error(error.message);
        Alert.alert(
          "추천 요청 실패",
          error instanceof Error
            ? error.message
            : "AI 추천을 가져오지 못했습니다.",
        );
      },
    });

  const handleSelectAnswer = (answer: string) => {
    if (answers[currentStep.key] === answer) {
      setAnswers((prev) => ({
        ...prev,
        [currentStep.key]: answer,
      }));
    }
    setAnswers((prev) => ({
      ...prev,
      [currentStep.key]: answer,
    }));
  };

  const goNext = async () => {
    if (isRecommendationPending) {
      return;
    }

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
      if (!accessToken) {
        Alert.alert(
          "로그인이 필요해요",
          "AI 추천을 받으려면 다시 로그인해 주세요.",
        );
        return;
      }

      const requestPayload = buildAIRecommendationRequest(nextAnswers);
      setAIRequest(requestPayload);
      AIRecommendation(requestPayload);
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

        {recommendation ? (
          <View className="mb-8 gap-4">
            <View className="gap-2">
              <Text className="text-[26px] font-black text-gray-01">
                추천 동선이 준비됐어요
              </Text>
              <Text className="text-[14px] leading-5 text-gray-02">
                상세 보기에서 장소별 이유를 보고, 마음에 들면 동선으로 저장해요.
              </Text>
            </View>
            <RecommendCard recommendation={recommendation} source="ai" />
          </View>
        ) : null}

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
                  onPress={() => handleSelectAnswer(option)}
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
            title={
              isLastStep
                ? isRecommendationPending
                  ? "추천 받는 중"
                  : AIrequest
                    ? "다시 추천 받기"
                    : "추천 받기"
                : "다음"
            }
            size="small"
            color={
              (selectedAnswer || currentStep.optional) &&
              !isRecommendationPending
                ? "gradient"
                : "disabled"
            }
            onPress={goNext}
          />
        </View>

        {isRecommendationPending ? (
          <View className="mt-5 items-center">
            <ActivityIndicator color="#739E6B" />
            <Text className="mt-2 text-[13px] font-medium text-gray-02">
              취향에 맞는 동선을 고르는 중이에요
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
