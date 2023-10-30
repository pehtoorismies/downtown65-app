import type { EventType } from '@downtown65-app/graphql/graphql'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Voucher } from '~/components/voucher/voucher'
import type { User } from '~/domain/user'
import { mapToData } from '~/util/event-type'

interface Props {
  title: string
  createdBy: { nickname: string }
  type: EventType
  user: User | null
  race: boolean
  participants: { id: string }[]
}

export const EventHeader = ({
  createdBy,
  type,
  user,
  race,
  participants,
  title,
}: PropsWithChildren<Props>) => {
  return (
    <Voucher.Header bgImageUrl={mapToData(type).imageUrl}>
      <Voucher.Header.Title>{title}</Voucher.Header.Title>
      <Voucher.Header.ParticipantCount
        user={user}
        participants={participants}
      />
      <Voucher.Header.Creator nick={createdBy.nickname} />
      {race && <Voucher.Header.Competition />}
    </Voucher.Header>
  )
}
