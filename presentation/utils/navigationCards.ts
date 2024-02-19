// Card list
export const navigationCards = [
  {
    label: 'Home',
    route: 'Home',
    icon: 'home-outline',
    params: {}
  },
  {
    label: 'Bandas',
    route: 'Bands',
    icon: 'people-outline',
    params: {}
  },
  {
    label: 'Músicas',
    route: 'Songs',
    icon: 'headphones-outline',
    params: {}
  },
  {
    label: 'Meu Perfil',
    route: 'Profile',
    icon: 'person-outline',
    params: {}
  }
]

export const getNavigationCards = (
  homeLabel: string,
  bandLabel: string,
  songLabel: string,
  profileLabel: string
) => [
  {
    label: homeLabel,
    route: 'Home',
    icon: 'home-outline',
    params: {}
  },
  {
    label: bandLabel,
    route: 'Bands',
    icon: 'people-outline',
    params: {}
  },
  {
    label: songLabel,
    route: 'Songs',
    icon: 'headphones-outline',
    params: {}
  },
  {
    label: profileLabel,
    route: 'Profile',
    icon: 'person-outline',
    params: {}
  }
]
