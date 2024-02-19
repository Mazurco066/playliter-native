// Dependencies
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { color } from 'styled-system'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useRefreshOnFocus } from '../../../../hooks'
import {
  generateCaption,
  isValidUrl,
  plaintextToChordProFormat,
  removeLeadingTrailingNewlines,
  removeMusicalTabs,
  removeTextPatternsFromSong,
  removeToneText
} from '../../../../utils'

// Api
import api from '../../../../../infra/api'

// Types
import { AddSongDto, UpdateSongDto } from '../../../../../domain/dto'
import { ISong, ISongCategory } from '../../../../../domain/models'
import { MainStackParamList } from '../../../../../main/router'

// Components
import {
  Card,
  Icon,
  Input,
  Button,
  IndexPath,
  Select,
  SelectItem,
  Text,
  Toggle,
  useTheme
} from '@ui-kitten/components'
import { Chord } from 'chordsheetjs'
import { Linking, TouchableOpacity, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { CustomKeyboardAvoidingView, Space } from '../../../../components'
import { BaseContent } from '../../../../layouts'

// Styled components
const ImportContainer = styled(Card)`
  border-radius: 8px;
`

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
  const { control, handleSubmit, formState: { errors }, setValue } = useForm()
  const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const [ song ] = useState<ISong | null>(item)
  const [ songUrl, setSongUrl ] = useState<string>('')
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ selectedToneIndex, setSelectedToneIndex ] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0))
  const [ selectedCategoryIndex, setSelectedCategoryIndex ] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0))
  const { t } = useTranslation()

  // Http requests
  const {
    data: bandCategories,
    isLoading: isFetchingCategories,
    refetch: refetchCategories
  } = useQuery(
    [`band-categories-${bandId}`],
    () => api.songs.getBandSongCategories(bandId)
  )
  
  const {
    isLoading: isSaveLoading,
    mutateAsync: saveSongAction
  } = useMutation(
    (data: { id?: string, dto: AddSongDto | UpdateSongDto }) =>
      data.id
        ? api.songs.updateSong(data.id, data.dto)
        : api.songs.addSong(bandId, data.dto as AddSongDto)
  )

  const {
    isLoading: isScrapLoading,
    mutateAsync: scrapSongAction
  } = useMutation(
    (url: string) => api.helpers.scrapSongs(url)
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
      const editableBody = song.body
        .replaceAll('<br>', '\n')
        .replace(/{title:(.*)}\n/, '')
        .replace(/{artist:(.*)}\n/, '')
        .replace(/{key:(.*)}\n/, '')
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', item.title, options)
      setValue('writter', song.writter, options)
      setValue('embeddedUrl', song.embeddedUrl, options)
      setValue('isPublic', song.isPublic, options)
      setValue('body', editableBody, options)
    } else {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('writter', '', options)
      setValue('embeddedUrl', '', options)
      setValue('isPublic', true, options)
      setValue('body', '', options)
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
  const isLoading = isFetchingCategories || isSaveLoading || isScrapLoading
  const categoryArray = bandCategories?.data?.data?.data || []
  
  // Actions
  const submitSong = async (data: {
    title: string,
    body: string,
    writter: string,
    isPublic: boolean,
    embeddedUrl: string
  }) => {
    // Get ui kitten component values and destruct values
    const { body, embeddedUrl, isPublic, title, writter } = data
    const songTone = transpositions.find(t => t.step === Number(selectedToneIndex.toString()) - 1)?.label
    const songCategory = categoryArray.find((_: ISongCategory, idx: number) => idx === Number(selectedCategoryIndex.toString()) - 1)
    
    // Mofifiable body text
    let bodyText = plaintextToChordProFormat(body) 

    // Define body metadata
    const hasTitle = bodyText.includes('{title:')
    const hasArtist = bodyText.includes('{artist:')
    const hasKey = bodyText.includes('{key:')

    // Add snippets tags if not present
    if (!hasKey) bodyText = `{key: ${songTone}}\n` + bodyText
    if (!hasArtist) bodyText = `{artist: ${writter}}\n` + bodyText
    if (!hasTitle) bodyText = `{title: ${title}}\n` + bodyText

    // Mounting payload
    const songPayload: AddSongDto | UpdateSongDto = {
      title,
      writter,
      tone: songTone,
      category: songCategory?.id,
      body: bodyText,
      embeddedUrl: embeddedUrl || undefined,
      isPublic
    }

    // Saving song
    const response = await saveSongAction({
      dto: songPayload,
      id: (item && item.id) ? item.id : null
    })

    if ([200, 201].includes(response.status)) {
      showMessage({
        message: t('success_msgs.save_song_msg'),
        type: 'success',
        duration: 2000
      })
      goBack()
    } else if ([400].includes(response.status)) {
      showMessage({
        message: t('error_msgs.invalid_form_msg'),
        type: 'warning',
        duration: 2000
      })
    } else if ([404].includes(response.status)) {
      showMessage({
        message: t('error_msgs.song_not_found_msg'),
        type: 'info',
        duration: 2000
      })
    } else {
      showMessage({
        message: t('error_msgs.save_song_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  const submitImportSong = async () => {
    // Validate url
    if (!songUrl) {
      return showMessage({
        message: t('error_msgs.no_url_msg'),
        type: 'warning',
        duration: 2000
      })
    }
    if (!isValidUrl(songUrl)) {
      return showMessage({
        message: t('error_msgs.invalid_url_msg'),
        type: 'warning',
        duration: 2000
      })
    }
    if (
      !songUrl.includes('cifras.com.br')
      && !songUrl.includes('cifraclub.com.br')
    ) {
      return showMessage({
        message: t('error_msgs.type_url_msg'),
        type: 'info',
        duration: 2000
      })
    }

    // Request song data on cifraclub or cifras.com
    const response = await scrapSongAction(songUrl)
    if ([200, 201].includes(response.status)) {

      // Destruct song data
      const { loot, writter, title } = response.data.data

      // Format song body to chordpro
      const withoutLeadingTrails = removeLeadingTrailingNewlines(loot)
      const withoutTabs = removeMusicalTabs(withoutLeadingTrails)
      const withoutPrefixes = removeTextPatternsFromSong(withoutTabs)
      const withoutTone = removeToneText(withoutPrefixes)
      const chordproBody = plaintextToChordProFormat(withoutTone)

      // Fill form data
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', title, options)
      setValue('writter', writter, options)
      setValue('body', chordproBody, options)

      // User feedback
      showMessage({
        message: t('success_msgs.song_import_msg', { name: songUrl }),
        type: 'success',
        duration: 2000
      })
      setSongUrl('')

    } else {
      return showMessage({
        message: t('error_msgs.song_import_error_msg'),
        type: 'danger',
        duration: 2000
      })
    }
  }

  // TSX
  return (
    <BaseContent hideCardsNavigation>
      <Text category="h5">
        {t('song_screen.save_song_heading')}
      </Text>
      <Space my={1} />
      <Text category="s1">
        {
          item
            ? t('song_screen.update_song_placeholder')
            : t('song_screen.save_song_placeholder')
        }
      </Text>
      <Space my={2} />
      <ImportContainer>
        <CustomKeyboardAvoidingView>
          <Text
            style={{ fontWeight: 'bold' }}
          >
            {t('song_screen.import_heading')}
          </Text>
          <Space my={1} />
          <Text>
            {t('song_screen.import_placeholder')}
          </Text>
          <Space my={1} />
          <Input
            size="small"
            placeholder="https://cifrablub.com.br/..."
            value={songUrl}
            onChangeText={val => setSongUrl(val)}
            disabled={isLoading}
          />
          <Space my={1} />
          <Button
            size="small"
            disabled={isLoading}
            onPress={submitImportSong}
          >
            {t('song_screen.import_action')}
          </Button>
        </CustomKeyboardAvoidingView>
      </ImportContainer>
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
            name="isPublic"
            rules={{ required: false }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Toggle
                status="primary"
                disabled={isLoading}
                checked={value}
                onChange={onChange}
                onBlur={onBlur}
              >
                {t('song_screen.public_label')}
              </Toggle>
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Controller
            control={control}
            name="title"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label={t('song_screen.title_label')}
                size="small"
                placeholder={t('song_screen.title_placeholder')}
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
                label={t('song_screen.writter_label')}
                size="small"
                placeholder={t('song_screen.writter_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="person-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.writter as FieldError)}
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
            rules={{ required: false, minLength: 7 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label={t('song_screen.url_label')}
                size="small"
                placeholder={t('song_screen.url_placeholder')}
                keyboardType="default"
                accessoryLeft={props => <Icon {...props} name="globe-outline" />}
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.embeddedUrl as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={1} />
          <Select
            label={t('song_screen.tone_label')}
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
                  label={t('song_screen.category_label')}
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
            style={{
              textAlign: 'justify',
              width: '100%'
            }}
          >
            {t('song_screen.web_warning')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://playliter.com.br')
            }}
            style={{ width: '100%' }}
          >
            <Text
              category="c1"
              style={{
                textDecorationLine: 'underline',
                textAlign: 'left'
              }}
            >
              {t('song_screen.web_link')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://www.chordpro.org')
            }}
            style={{ width: '100%' }}
          >
            <Text
              category="c1"
              style={{
                textDecorationLine: 'underline',
                textAlign: 'left'
              }}
            >
              {t('song_screen.chordpro_link')}
            </Text>
          </TouchableOpacity>
          <Space my={1} />
          <Controller
            control={control}
            name="body"
            rules={{ required: true, minLength: 2 }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                multiline
                label={t('song_screen.song_label')}
                size="small"
                placeholder={t('song_screen.song_placeholder')}
                keyboardType="default"
                value={value}
                onBlur={onBlur}
                onChangeText={nextValue => onChange(nextValue)}
                caption={generateCaption(errors.body as FieldError)}
                textStyle={textStyle}
                disabled={isLoading}
              />
            )}
            defaultValue=""
          />
          <Space my={2} />
          <Button
            disabled={isLoading}
            onPress={handleSubmit(submitSong)}
            style={{ width: '100%' }}
          >
            {t('song_screen.save_action')}
          </Button>
        </CustomKeyboardAvoidingView>
      </Container>
    </BaseContent>
  )
}

export default EditSongScreen