// Dependencies
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'

// Components
import { Text } from '@ui-kitten/components'
import { Image, View } from 'react-native'
import { Space } from '../../components'
import { BaseContent } from '../../layouts'

// Styled components
const Wrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-top: 8px;
  ${color}
`

const Logo = styled(Image)`
  width: 150px;
  height: 150px;
  margin-bottom: 16px;
`

// Page Main JSX
const AboutScreen = ({ navigation }) => {
  // Hooks
  const { t } = useTranslation()

  // Component TSX
  return (
    <BaseContent>
      <Wrapper>
        <Logo source={require('../../../assets/logo_white.png')} />
        <Text category="h5">
          {t('about_screen.app_name')}
        </Text>
        <Space my={1} />
        <Text
          category="c1"
        >
          {t('about_screen.version')}1.1.1
        </Text>
        <Space my={2} />
        <Text
          category="s1"
          style={{
            textAlign: "center"
          }}
        >
          {t('about_screen.app_description')}
        </Text>
      </Wrapper>
    </BaseContent>
  )
}

// Exporting page
export default AboutScreen