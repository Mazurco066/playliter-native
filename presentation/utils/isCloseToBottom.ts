import { NativeScrollEvent } from 'react-native'

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize
}: NativeScrollEvent) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
}