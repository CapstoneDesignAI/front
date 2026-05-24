import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  className?: string;
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const typeClassName = {
  default: 'font-[Pretendard] text-base leading-6',
  defaultSemiBold: 'font-[PretendardSemiBold] text-base leading-6',
  title: 'font-[PretendardBold] text-[32px] leading-8',
  subtitle: 'font-[PretendardBold] text-xl',
  link: 'font-[Pretendard] text-base leading-[30px]',
};

export function ThemedText({
  className,
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColor = type === 'link' ? '#7D9AAE' : color;

  return (
    <Text
      className={`${typeClassName[type]} ${className ?? ''}`}
      style={[{ color: textColor }, style]}
      {...rest}
    />
  );
}
