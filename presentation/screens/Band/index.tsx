// Dependencies
import React, { useState, useEffect }  from 'react'
import { useQuery } from '@tanstack/react-query'
import { IBand } from '../../../domain'

// Main API
import api from '../../../infra/api'

// Components
import { Text } from '@ui-kitten/components'
import { BaseContent } from '../../layouts'

// Styled components

// Page Main component
const BandScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { item } = route.params

  // Hooks
  const [ band, setBand ] = useState<IBand>(item)

  // Http requests
  const {
    data: updatedItem,
    refetch: refetchItem
  } = useQuery(
    [`get-band-${band.id}`],
    () => api.bands.getBand(band.id)
  )

  // Effects
  useEffect(() => {
    if (updatedItem && updatedItem.data) {
      const { data } = updatedItem.data
      if (data) setBand(data as IBand)
    }
  }, [updatedItem])

  // TSX
  return (
    <BaseContent>
      <Text>Band - {band.title}</Text>
    </BaseContent>
  )
} 

// Exporting page
export default BandScreen