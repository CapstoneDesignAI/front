import type { FavoriteFolder } from "./types";

export const favoriteFolders: FavoriteFolder[] = [
  {
    id: "1",
    name: "춘천 카페",
    description: "커피 마시기 좋은 장소",
    places: [
      {
        id: 101,
        name: "모토모토 MotoMoto",
        distance: "200m",
        description: "춘천 3층짜리 대형 카페",
        tags: ["감성", "조용한"],
      },
      {
        id: 102,
        name: "감자밭 카페",
        distance: "2.4km",
        description: "감자빵과 넓은 정원이 있는 카페",
        tags: ["디저트", "가족"],
      },
    ],
  },
  {
    id: "2",
    name: "산책 코스",
    description: "가볍게 걷기 좋은 장소",
    places: [
      {
        id: 201,
        name: "소양강 스카이워크",
        distance: "1.1km",
        description: "호수 산책과 야경을 보기 좋은 코스",
        tags: ["관광", "산책"],
      },
      {
        id: 202,
        name: "공지천 유원지",
        distance: "1.7km",
        description: "물가를 따라 산책하기 좋은 공원",
        tags: ["휴식", "야경"],
      },
    ],
  },
  {
    id: "3",
    name: "로컬 맛집",
    description: "현지 분위기의 식당 모음",
    places: [
      {
        id: 301,
        name: "육림고개",
        distance: "1.8km",
        description: "로컬 식당과 작은 상점이 모인 거리",
        tags: ["맛집", "로컬"],
      },
    ],
  },
];
