import { graphql } from '@downtown65-app/graphql/gql'
import { UpdateAvatarDocument } from '@downtown65-app/graphql/graphql'
import {
  Alert,
  Anchor,
  Avatar,
  Breadcrumbs,
  Button,
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
import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
} from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import {
  IconAlertCircle,
  IconDownload,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import React, { useState } from 'react'
import { createProfileUploadHandler } from './s3-upload.server'
import { gqlClient } from '~/gql/get-gql-client.server'
import {
  actionAuthenticate,
  loaderAuthenticate,
  renewUserSession,
} from '~/session.server'
import { logger } from '~/util/logger.server'

const MEGA_BYTE = 1024 ** 2
const MAX_IMAGE_SIZE = 2 * MEGA_BYTE

type State =
  | { kind: 'error'; error: string; picture: string }
  | { kind: 'init'; picture: string }
  | { kind: 'newImageSet'; picture: string; fileWithPath: FileWithPath }

type ActionData = {
  errorMsg?: string
  imgSrc?: string
  imgDesc?: string
}

const _GqlIgnored = graphql(`
  mutation UpdateAvatar($uploadedFilename: String!) {
    updateAvatar(uploadedFilename: $uploadedFilename)
  }
`)

export const action: ActionFunction = async ({ request }) => {
  const { accessToken, user } = await actionAuthenticate(request)

  const s3UploadHandler = createProfileUploadHandler({
    userId: user.id,
  })

  const formData = await parseMultipartFormData(request, s3UploadHandler)
  const file = formData.get('file') as string

  await gqlClient.request(
    UpdateAvatarDocument,
    { uploadedFilename: file },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )

  const headers = await renewUserSession(request)

  return redirect('/profile', {
    headers,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pageLogger = logger.child({
    page: { path: 'profile/changeAvatar', function: 'loader' },
  })
  pageLogger.info('Load page: profile/changeAvatar')

  const { user } = await loaderAuthenticate(request)

  pageLogger.debug({ user }, 'Authenticated user')

  return json({ user })
}

function humanFileSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  )

  return bytes.toFixed(dp) + ' ' + units[u]
}

export default function ChangeAvatar() {
  const fetcher = useFetcher<ActionData>()
  const { user } = useLoaderData<typeof loader>()
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
    <>
      <Container fluid mt="xs">
        <Breadcrumbs mb="xs">
          <Anchor
            data-testid="breadcrumbs-parent"
            component={Link}
            to="/profile"
          >
            Oma profiili
          </Anchor>
          <Text data-testid="breadcrumbs-current">Vaihda profiilikuva</Text>
        </Breadcrumbs>
      </Container>
      <Container size="sm">
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
        <Title ta="center">Vaihda profiilikuva</Title>
        <Dropzone
          mt="sm"
          loading={fetcher.state === 'submitting'}
          maxFiles={1}
          multiple={false}
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
          maxSize={MAX_IMAGE_SIZE}
          accept={IMAGE_MIME_TYPE}
        >
          <Group
            justify="center"
            gap="xl"
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
                  Drägää kuva tähän (max. {humanFileSize(MAX_IMAGE_SIZE)})
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
            <Button
              leftSection={<IconUpload size={14} />}
              onClick={uploadImage}
              disabled={fetcher.state === 'submitting'}
            >
              Vaihda profiilikuva
            </Button>
            <Button
              color="dtPink.3"
              leftSection={<IconX size={14} />}
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
            Paras muoto profiilikuvallesi on&nbsp;
            <Text fw={700} span>
              neliö
            </Text>{' '}
            (työkalu tähän esim.{' '}
            <Anchor href="https://croppola.com" target="_blank">
              croppola.com
            </Anchor>
            ). Eventsiin hyväksyttävät profiilikuvaformaatit:&nbsp;
            {IMAGE_MIME_TYPE.map((mime) => mime.replace('image/', '.')).join(
              ', '
            )}
            . Jos uusi profiilikuvasi ei näy päivityksen jälkeen, loggaudu ulos
            ja kirjaudu uudelleen sisään.
          </Text>
          <Title order={3} mt="sm">
            Profiilikuva tapahtumissa
          </Title>
          <Text>
            Kun muutat profiilikuvaasi, se päivittyy ainoastaan tuleviin
            ilmoittautumisiin. Profiilikuvasi tapahtumassa on se mikä sinulla
            oli profiilikuvanasi tapahtumaan liittyessäsi. Jos haluat uuden
            profiilikuvasi näkyvän, niin poistu ja liity tapahtumaan uudelleen.
            Jos olet kirjautunut monella eri laitteella, vaatii profiilikuvan
            päivitys uloskirjautumisen kaikilta laitteilta.
          </Text>
        </Paper>
      </Container>
    </>
  )
}
