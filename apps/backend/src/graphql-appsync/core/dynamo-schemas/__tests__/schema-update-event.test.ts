import { ISODate, ISOTime } from '@downtown65-app/time'
import { EventType } from '@downtown65-app/types'
import { describe, expect, it, test } from 'vitest'
import type { EventUpdateSchemaInput } from '../event-schema'
import { EventUpdateSchema } from '../event-schema'

const updateSchema: EventUpdateSchemaInput = {
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
  data: EventUpdateSchemaInput
  failKey: keyof EventUpdateSchemaInput
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
      const { title, location } = EventUpdateSchema.parse(updateSchema)
      expect(title).toBe('Title')
      expect(location).toBe('Sipoo')
    })

    it('should add description to $remove', () => {
      const { $remove } = EventUpdateSchema.parse({
        ...updateSchema,
        description: undefined,
      })
      expect($remove).toContain('description')
      expect($remove.length).toBe(1)
    })

    it('should add timeStart to $remove', () => {
      const { $remove } = EventUpdateSchema.parse({
        ...updateSchema,
        GSI1SK: 'DATE#2023-02-02T00:00:00#01GW4MMH',
        timeStart: undefined,
      })
      expect($remove).toContain('timeStart')
      expect($remove.length).toBe(1)
    })

    it('should add all fields to $remove', () => {
      const { $remove } = EventUpdateSchema.parse({
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
      const result = EventUpdateSchema.safeParse(data)
      if (result.success) {
        throw new Error('Should fail')
      }
      expect(result.error.format()[failKey]).toBeDefined()
    })
  })
})
