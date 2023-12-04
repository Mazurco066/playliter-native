export const getColoredUrl = (color: string) => {
  switch (color) {
    case 'green':
      return 'https://raw.githubusercontent.com/Mazurco066/cdn/main/playliter-bg-green.png'
    case 'red':
      return 'https://raw.githubusercontent.com/Mazurco066/cdn/main/playliter-bg-red.png'
    case 'pink':
      return 'https://raw.githubusercontent.com/Mazurco066/cdn/main/playliter-bg-pink.png'
    case 'black':
      return 'https://raw.githubusercontent.com/Mazurco066/cdn/main/playliter-bg-black.png'
    case 'white':
      return 'https://raw.githubusercontent.com/Mazurco066/cdn/main/playliter-bg-white.png'
    case 'purple':
    default:
      return 'https://raw.githubusercontent.com/Mazurco066/cdn/main/playliter-bg.png'
  }
}
