import { ISODate, ISOTime } from '@downtown65-app/core/time-functions'
import { EventType } from '@downtown65-app/graphql/graphql'
import { describe, expect, it, test } from 'vitest'
import type { Dt65EventUpdateSchemaInput } from '../dt65-event-schema'
import { Dt65EventUpdateSchema } from '../dt65-event-schema'

const updateSchema: Dt65EventUpdateSchemaInput = {
  PK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  SK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  GSI1SK: 'DATE#2023-02-02T09:30:00#01GW4MMH',
  dateStart: ISODate.parse('2023-02-02'),
  location: 'Sipoo   ',
  race: false,
  subtitle: 'Some subtitle',
  timeStart: ISOTime.parse('09:30'),
  title: ' Title',
  type: EventType.Karonkka,
  description: '<p>content</p>',
}

interface UpdateData {
  description: string
  data: Dt65EventUpdateSchemaInput
  failKey: keyof Dt65EventUpdateSchemaInput
}

describe('Dt65EventUpdateSchema', () => {
  const updateTestData: UpdateData[] = [
    {
      description: 'Wrong PK',
      data: {
        ...updateSchema,
        PK: 'EVENT#some_id',
      },
      failKey: 'PK',
    },
    {
      description: 'Wrong PK',
      data: {
        ...updateSchema,
        SK: 'EVENT#some_id',
      },
      failKey: 'SK',
    },
  ]

  describe('Dt65EventUpdateSchema', () => {
    it('should succeed to parse', () => {
      const { title, location } = Dt65EventUpdateSchema.parse(updateSchema)
      expect(title).toBe('Title')
      expect(location).toBe('Sipoo')
    })

    it('should add description to $remove', () => {
      const { $remove } = Dt65EventUpdateSchema.parse({
        ...updateSchema,
        description: undefined,
      })
      expect($remove).toContain('description')
      expect($remove.length).toBe(1)
    })

    it('should add timeStart to $remove', () => {
      const { $remove } = Dt65EventUpdateSchema.parse({
        ...updateSchema,
        GSI1SK: 'DATE#2023-02-02T00:00:00#01GW4MMH',
        timeStart: undefined,
      })
      expect($remove).toContain('timeStart')
      expect($remove.length).toBe(1)
    })

    it('should add all fields to $remove', () => {
      const { $remove } = Dt65EventUpdateSchema.parse({
        ...updateSchema,
        GSI1SK: 'DATE#2023-02-02T00:00:00#01GW4MMH',
        timeStart: undefined,
        description: undefined,
      })
      expect($remove).toContain('timeStart')
      expect($remove).toContain('description')
      expect($remove.length).toBe(2)
    })

    test.each(updateTestData)('$description', ({ data, failKey }) => {
      const result = Dt65EventUpdateSchema.safeParse(data)
      if (result.success) {
        throw new Error('Should fail')
      }
      expect(result.error.format()[failKey]).toBeDefined()
    })
  })
})
