// Dependencies
import React from 'react'
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
const AboutScreen = ({ navigation }) => (
  <BaseContent>
    <Wrapper>
      <Logo
        source={require('../../../assets/logo_white.png')}
      />
      <Text
        category="h5"
      >
        Playliter Native
      </Text>
      <Space my={1} />
      <Text
        category="c1"
      >
        Versão: 1.1.0
      </Text>
      <Space my={2} />
      <Text
        category="s1"
        style={{
          textAlign: "center"
        }}
      >
        O aplicativo Playliter é uma ferramenta indispensável para músicos que desejam simplificar a 
        gestão de seus repertórios musicais e criar apresentações memoráveis. Com o Playliter, músicos e 
        bandas podem facilmente organizar suas músicas, criar setlists personalizados e, o melhor de tudo, 
        exportá-los em um formato conveniente de arquivo PDF para uso em ensaios e apresentações ao vivo. 
        Adeus às pastas de papel e folhas soltas, o Playliter coloca todo o seu repertório na ponta dos dedos, 
        garantindo um desempenho impecável em todos os palcos. Simplifique sua vida musical com o Playliter e 
        concentre-se no que realmente importa: a música.
      </Text>
    </Wrapper>
  </BaseContent>
)

// Exporting page
export default AboutScreen