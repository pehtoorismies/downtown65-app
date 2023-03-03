import {
  Alert,
  Anchor,
  Avatar,
  Button,
  Code,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import type { FileWithPath } from '@mantine/dropzone'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import {
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import {
  IconAlertCircle,
  IconDownload,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import React, { useState } from 'react'
import type { PrivateRoute } from '~/domain/private-route'
import { createProfileUploadHandler } from '~/routes/profile/modules/s3-upload.server'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'

const MEGA_BYTE = 1024 ** 2

type State =
  | { kind: 'error'; error: string; picture: string }
  | { kind: 'init'; picture: string }
  | { kind: 'newImageSet'; picture: string; fileWithPath: FileWithPath }

type ActionData = {
  errorMsg?: string
  imgSrc?: string
  imgDesc?: string
}

export const action: ActionFunction = async ({ request }) => {
  const { headers, user } = await actionAuthenticate(request)

  const s3UploadHandler = createProfileUploadHandler({
    userId: user.id,
  })

  const formData = await parseMultipartFormData(request, s3UploadHandler)
  const file = formData.get('file')
  console.log('file', file)

  return json(
    {},
    {
      headers,
    }
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const { user } = await loaderAuthenticate(request)

  return json<PrivateRoute>({ user })
}

export default function ChangeAvatar() {
  const fetcher = useFetcher<ActionData>()
  const { user } = useLoaderData()
  const [state, setState] = useState<State>({
    kind: 'init',
    picture: user.picture,
  })

  const uploadImage = () => {
    if (state.kind !== 'newImageSet') {
      return
    }
    const formData = new FormData()
    formData.append('file', state.fileWithPath)
    fetcher.submit(formData, { method: 'post', encType: 'multipart/form-data' })
  }

  return (
    <Container pt="xl">
      {state.kind === 'error' && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Virhe kuvatiedostossa"
          color="red"
          m="xl"
        >
          Kuva on todennäköisesti liian suuri tai tiedostotyyppi on väärän.
          Käytä tyyppejä: gif, jpg, png.
        </Alert>
      )}
      <Title align="center">Vaihda profiilikuva</Title>

      <Dropzone
        maxFiles={1}
        onDrop={(files) => {
          const imageUrl = URL.createObjectURL(files[0])
          setState({
            kind: 'newImageSet',
            picture: imageUrl,
            fileWithPath: files[0],
          })
        }}
        onReject={() => {
          setState({ kind: 'error', error: 'Virhe', picture: user.picture })
        }}
        maxSize={1 * MEGA_BYTE}
        accept={IMAGE_MIME_TYPE}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 220, pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <Stack align="center">
              <IconDownload size={50} />
              <Text size="xl" color="dimmed" inline>
                Drop drop drop
              </Text>
            </Stack>
          </Dropzone.Accept>
          <Dropzone.Reject>
            <Stack align="center">
              <ThemeIcon color="red" size={80}>
                <IconX size={50} />
              </ThemeIcon>
              <Text size="xl" inline>
                Vääräntyyppinen tiedosto tai kuva liian iso
              </Text>
              <Text size="md" color="dimmed">
                Valitse: jpg, png.
              </Text>
            </Stack>
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Stack align="center">
              <Avatar
                src={state.picture}
                size={120}
                radius={120}
                mx="auto"
                color="blue"
              />
              <Text size="xl" inline>
                Drägää kuva tähän (max. 2Mb)
              </Text>
              <Text size="md" color="dimmed">
                Tai klikkaa valitaksesi tiedosto
              </Text>
            </Stack>
          </Dropzone.Idle>
        </Group>
      </Dropzone>
      {state.kind === 'newImageSet' && (
        <Stack align="center" m="xl">
          <Button leftIcon={<IconUpload size={14} />} onClick={uploadImage}>
            Vaihda profiilikuva
          </Button>
          <Button
            color="dtPink.3"
            leftIcon={<IconX size={14} />}
            onClick={() => {
              setState({ kind: 'init', picture: user.picture })
            }}
          >
            Pidä alkuperäinen
          </Button>
        </Stack>
      )}
      <Paper shadow="xs" p="md" my="sm">
        <Title order={3}>Ohje</Title>
        <Text>
          Optimaalisesti profiilikuvasi tulisi olla&nbsp;
          <Text fw={700} span>
            neliön
          </Text>{' '}
          muotoinen (työkalu tähän esim.{' '}
          <Anchor href="https://croppola.com" target="_blank">
            croppola.com
          </Anchor>
          ). Eventsiin hyväksyttävät profiilikuvaformaatit:&nbsp;
          <Code>
            {IMAGE_MIME_TYPE.map((mime) => mime.replace('image/', '.')).join(
              ', '
            )}
          </Code>
          . Jos uusi profiilikuvasi ei näy päivityksen jälkeen, loggaudu ulos ja
          kirjaudu uudelleen sisään.
        </Text>
        <Title order={3} mt="sm">
          Profiilikuva tapahtumissa
        </Title>
        <Text>
          Kun muutat profiilikuvaasi, se päivittyy ainoastaan tuleviin
          ilmoittautumisiin. Toisin sanoen profiilikuvasi tapahtumassa on se
          mikä sinulla oli liittyessäsi. Jos haluat uuden profiilikuvasi
          näkyvän, niin poistu ja liity tapahtumaan uudelleen.
        </Text>
      </Paper>
    </Container>
  )
}
