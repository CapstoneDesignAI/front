interface IKakaoLoginUrlResponse {
  authorization_url: string;
  state: string;
}

interface IPostLoginType {
  resultCode: number;
  resultMsg: string;
  email: string;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
  nickname: string;
}
