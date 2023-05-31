// Dependencies
import { Icon, IconElement } from '@ui-kitten/components'

// Get icon function
export const getIcon = (
  iconName: string,
  fill: string = '#ffffff'
) => (props: any): IconElement => (
  <Icon
    {...props}
    name={iconName}
    fill={fill}
  />
)