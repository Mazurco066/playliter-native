// Dependencies
import { createRef } from 'react'

// Refs to mounted navigation service
export const navigationRef: any = createRef()
export const isMountedRef = createRef()

// Replace route function
export const replace = (name: string, params?: any) => {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.replace(name, params)
  }
}