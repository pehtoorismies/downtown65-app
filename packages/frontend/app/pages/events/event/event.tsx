import {
  Anchor,
  Breadcrumbs,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { IconCircleOff, IconCircleX, IconPencil } from '@tabler/icons'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { LoaderData } from './loader'
import { EventCardExtended } from '~/components/event-card/event-card-extended'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const Event = () => {
  const { eventItem } = useLoaderData<LoaderData>()
  const participationActions = useParticipationActions()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const [formValue, setFormValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const items = [
    { title: 'Tapahtumat', href: '/events' },
    { title: eventItem.title, href: `/events/${eventItem.id}` },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue(event.target.value)
  }

  const onCloseModal = () => {
    setFormValue('')
    setOpened(false)
  }

  const onDeleteEvent = async () => {
    setIsDeleting(true)
    await sleep(3000)
    setIsDeleting(false)
    navigate('/')
  }

  return (
    <>
      <Modal opened={opened} onClose={onCloseModal} title="Tapahtuman poisto">
        <LoadingOverlay visible={isDeleting} transitionDuration={200} />
        <TypographyStylesProvider my="sm">
          <h3>Olet poistamassa tapahtumaa</h3>
          <p>
            Sinun pitää varmistaa tapahtuman{' '}
            <strong>"{eventItem.title}"</strong> poistaminen.
            <br /> Kirjoita allaolevaan kenttään <i>poista</i> ja klikkaa
            Poista.
          </p>
        </TypographyStylesProvider>

        <TextInput
          placeholder="poista"
          label="Kirjoita 'poista'"
          value={formValue}
          onChange={handleChange}
        />

        <Text mt="sm">
          Voit peruuttaa poiston sulkemalla dialogin tai klikkaamalla Peruuta.
        </Text>
        <Group position="apart" mt="lg">
          <Button onClick={onCloseModal} leftIcon={<IconCircleX size={18} />}>
            Peruuta
          </Button>
          <Button
            color="red"
            disabled={formValue !== 'poista'}
            onClick={onDeleteEvent}
            rightIcon={<IconCircleOff size={18} />}
          >
            Poista
          </Button>
        </Group>
      </Modal>
      <Container pt={12}>
        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
        <ParticipatingContext.Provider value={participationActions}>
          <EventCardExtended {...eventItem} />
        </ParticipatingContext.Provider>
        <Text align="center" mt="xl" weight={600} color="dimmed">
          Modification zone
        </Text>
        <Group position="center" my="xl" spacing="xl">
          <Button rightIcon={<IconPencil size={18} />}>Muokkaa</Button>
          <Button
            color="grape"
            onClick={() => setOpened(true)}
            rightIcon={<IconCircleOff size={18} />}
          >
            Poista tapahtuma
          </Button>
        </Group>
      </Container>
    </>
  )
}
