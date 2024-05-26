export const getColorSchema = (color: string) => {
  switch (color) {
    case 'green':
      return {
        primary: '#5D9C59',
        secondary: '#DF7857'
      }
    case 'red':
      return {
        primary: '#BE3144',
        secondary: '#BE3144'
      }
    case 'pink':
      return {
        primary: '#EA97AD',
        secondary: '#E48586'
      }
    case 'black':
    case 'white':
      return {
        primary: '#212121',
        secondary: '#4963f7'
      }
    case 'purple':
    default:
      return {
        primary: '#8257e5',
        secondary: '#4963f7'
      }
  }
}
