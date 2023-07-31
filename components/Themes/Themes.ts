export type AccentColor = {
  title: string
  accent: string
  accentText: string
}

export const accentColors: AccentColor[] = [
  { title: 'Red', accent: '#ED4242', accentText: 'white' },
  { title: 'Carrot', accent: '#ED9B42', accentText: 'black' },
  { title: 'Yellow', accent: '#EDCE42', accentText: 'black' },
  { title: 'Green', accent: '#70ED42', accentText: 'black' },
  { title: 'Aqua', accent: '#42EDB1', accentText: 'black' },
  { title: 'Default', accent: '#4361EE', accentText: 'white' },
  { title: 'Purple', accent: '#9242ED', accentText: 'white' },
  { title: 'Rose', accent: '#ED42C2', accentText: 'white' },
]

export const lightTheme = {
  type: 'light',
  body: 'rgb(245, 245, 255)',
  text: 'rgb(10, 10, 10)',
  textLight: 'rgb(65, 65, 65)',
  border: 'rgb(187,187,198)',
  boxShadow: '#a0a0a9',
  backgroundNoGrad: 'rgb(234, 234, 244)',
  background: 'linear-gradient(to bottom, rgb(233, 233, 243) 0%, rgb(235, 235, 245) 100%)',
  buttonLight: 'rgb(228, 228, 239)',
  buttonMed: 'rgb(219, 219, 231)',
  buttonMedGradient: 'linear-gradient(180deg, rgb(219, 219, 231) 0%, rgb(221, 221, 235) 100%)',
  opacityBackground: 'rgba(150, 150, 150, 0.4)',
  medOpacity: 'rgba(206, 206, 216, 0.3)',
  lowOpacity: 'rgba(221, 221, 231, 0.2)',
  navBgOpacity: 'rgba(185, 185, 197, 0.3)',
  darkBg: 'rgb(219, 219, 229)',

  danger: '#DC3545',
  defaultAccent: '#4361EE',

  shades: {
    1: '#FFFFFF',
    2: '#E3E3E3',
    3: '#C6C6C6',
    4: '#AAAAAA',
    5: '#8E8E8E',
    6: '#717171',
    7: '#555555',
    8: '#393939',
    9: '#1C1C1C',
    10: '#393939',
  },
}

export const darkTheme = {
  type: 'dark',
  body: '#20222c',
  text: '#FAFAFA',
  textLight: '#999999',
  border: 'rgb(60,62,65)',
  boxShadow: '#111111',
  backgroundNoGrad: 'rgb(40,40,45)',
  background: 'linear-gradient(to top, rgb(39, 40, 46) 0%, rgb(38, 40, 45) 100%)',
  buttonLight: '#4b4b4b',
  buttonMed: 'rgb(54,55,60)',
  buttonMedGradient: 'linear-gradient(180deg, rgb(56,58,63) 0%, rgb(52,55,65) 100%)',
  opacityBackground: 'rgba(0, 0, 0, 0.4)',
  medOpacity: 'rgba(0, 0, 25, 0.25)',
  lowOpacity: 'rgba(0, 0, 25, 0.18)',
  navBgOpacity: 'rgba(7, 7, 12, 0.3)',
  darkBg: 'rgb(29,31,40)',

  danger: '#DC3545',
  defaultAccent: '#4361EE',

  shades: {
    1: '#FFFFFF',
    2: '#E3E3E3',
    3: '#C6C6C6',
    4: '#AAAAAA',
    5: '#8E8E8E',
    6: '#717171',
    7: '#555555',
    8: '#393939',
    9: '#1C1C1C',
    10: '#393939',
  },
}
