// Dependencies
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useRefreshOnFocus } from '../../../../hooks'
import { generateCaption, plaintextToChordProFormat } from '../../../../utils'

// Api
import api from '../../../../../infra/api'

// Types
import { ISong, ISongCategory } from '../../../../../domain/models'

// Components
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor'
import { Icon, Input, Button, IndexPath, Select, SelectItem, Text, Toggle, useTheme } from '@ui-kitten/components'
import { Chord } from 'chordsheetjs'
import { View } from 'react-native'
import { CustomKeyboardAvoidingView, Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const Container = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  ${color}
`

// General styles
const textStyle = {
  paddingTop: 12,
  paddingRight: 24,
  paddingBottom: 12,
  paddingLeft: 24,
  marginTop: -8,
  marginRight: -8,
  marginBottom: -8,
  marginLeft: -8
}

// Main Page
const EditSongScreen = ({ route }): React.ReactElement => {
  // Destruct params
  const { bandId, item } = route.params

  // Hooks
  const theme = useTheme()
  const codeFieldRef = useRef(null)
  const { control, handleSubmit, formState: { errors }, setValue } = useForm()
  const [ song ] = useState<ISong | null>(item)
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ selectedToneIndex, setSelectedToneIndex ] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0))
  const [ selectedCategoryIndex, setSelectedCategoryIndex ] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0))
  const [ songBody, setSongBody ] = useState<string>(
    item
      ? item.body
        .replaceAll('<br>', '\n')
        .replace(/{title:(.*)}\n/, '')
        .replace(/{artist:(.*)}\n/, '')
        .replace(/{key:(.*)}\n/, '')
      : ''
  )

  // Http requests
  const {
    data: bandCategories,
    isLoading: isFetchingCategories,
    refetch: refetchCategories
  } = useQuery(
    [`band-categories-${bandId}`],
    () => api.songs.getBandSongCategories(bandId)
  )

  // Refething
  useRefreshOnFocus(refetchCategories)

  // Effects
  useEffect(() => {
    // Transpositions
    const baseTone = song ? song.tone : 'B'
    const key = Chord.parse(baseTone)
    const steps = []
    for (let i = 0; i <= 11; i++) {
      steps.push({
        step: i,
        name: key.transpose(i),
        label: key.transpose(i).toString()
      })
    }
    setTranspositions(steps)
    
    // Song form
    if (song) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', item.title, options)
      setValue('writter', song.writter, options)
      setValue('embeddedUrl', song.embeddedUrl, options)
    } else {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('writter', '', options)
      setValue('embeddedUrl', '', options)
    }
  }, [song])

  useEffect(() => {
    if (bandCategories && bandCategories?.data?.data?.data) {
      const array: ISongCategory[] = bandCategories?.data?.data?.data || []
      if (song) {
        const categoryId = song.category.id
        const index = array.findIndex(c => c.id === categoryId)
        setSelectedCategoryIndex(new IndexPath(index))
      }
    }
  }, [bandCategories, song])

  // Global loader status and computed array
  const isLoading = isFetchingCategories
  const categoryArray = bandCategories?.data?.data?.data || []
  
  // Actions
  const submitSong = async () => {
    // Define body metadata
    // const hasTitle = bodyText.includes('{title:')
    // const hasArtist = bodyText.includes('{artist:')
    // const hasKey = bodyText.includes('{key:')

    // Add snippets tags if not present
    // if (!hasKey) bodyText = `{key: ${data.tone}}\n` + bodyText
    // if (!hasArtist) bodyText = `{artist: ${data.writter}}\n` + bodyText
    // if (!hasTitle) bodyText = `{title: ${data.title}}\n` + bodyText
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        Salvar música
      </Text>
      <Space my={1} />
      <Text category="s1">
        {
          item
            ? 'Atualize os dados da música:'
            : 'Insira os dados para salvar uma nova música'
        }
      </Text>
      <Space my={2} />
      <Container
        style={{
          backgroundColor: theme['color-basic-700']
        }}
      >
        <CustomKeyboardAvoidingView
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Controller
            control={control}
            name="title"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label="Título"
                size="small"
                placeholder="Insira um título"
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="mic-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.title as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Controller
            control={control}
            name="writter"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label="Autor"
                size="small"
                placeholder="Insira o autor da música"
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="person-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.title as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Controller
            control={control}
            name="embeddedUrl"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label="URL da música (opcional)"
                size="small"
                placeholder="Url embeeded youtube ou spotify"
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="globe-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.title as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={1} />
          <Select
            label="Tom base"
            selectedIndex={selectedToneIndex}
            onSelect={index => setSelectedToneIndex(index)}
            accessoryLeft={props => <Icon {...props} name="text-outline" />}
            size="medium"
            style={{ marginTop: 4, width: '100%' }}
            value={transpositions.find(t => t.step === Number(selectedToneIndex.toString()) - 1)?.label}
            disabled={isLoading}
          >
            {
              transpositions.map((t: any, i: number) => (
                <SelectItem
                  key={i}
                  title={t.label}
                />
              ))
            }
          </Select>
          <Space my={2} />
          {
            !isFetchingCategories ? (
              <>
                <Select
                  label="Categoria da música"
                  selectedIndex={selectedCategoryIndex}
                  onSelect={index => setSelectedCategoryIndex(index)}
                  accessoryLeft={props => <Icon {...props} name="text-outline" />}
                  size="medium"
                  style={{ marginTop: 4, width: '100%' }}
                  value={categoryArray.find((_: ISongCategory, idx: number) => idx === Number(selectedCategoryIndex.toString()) - 1)?.title}
                  disabled={isLoading}
                >
                  {
                    categoryArray.map((t: ISongCategory, i: number) => (
                      <SelectItem
                        key={i}
                        title={t.title}
                      />
                    ))
                  }
                </Select>
                <Space my={2} />
              </>
            ) : null
          }
          <Text
            category="c1"
            status="warning"
          >
            OBS: É recomendado editar a música e suas notas no formato chordpro utilizando a versão WEB 
            do aplicativo pois sua expêriencia com o editor de música será melhor.
          </Text>
          <Space my={1} />
          <CodeEditor
            ref={codeFieldRef}
            initialValue={songBody}
            syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
            language="plaintext"
            showLineNumbers
            onChange={newValue => {
              const formattedValue = plaintextToChordProFormat(newValue)
              //codeFieldRef.current.setNativeProps({ text: formattedValue })
              setSongBody(formattedValue)
            }}
            style={{
              fontSize: 12,
              inputLineHeight: 16,
              highlighterLineHeight: 16,
              height: 200,
              width: '100%'
            }}
          />
          <Space my={2} />
          <Button
            disabled={isLoading}
            onPress={handleSubmit(submitSong)}
            style={{ width: '100%' }}
          >
            Salvar
          </Button>
        </CustomKeyboardAvoidingView>
      </Container>
    </BaseContent>
  )
}

export default EditSongScreen