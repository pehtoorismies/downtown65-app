import type { MetaFunction } from '@remix-run/node'
import type { loader } from '~/pages/events/get/loader'
import { mapToData } from '~/util/event-type'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const { eventItem, origin } = data
  const typeData = mapToData(eventItem.type)
  return {
    title: eventItem.title,
    'og:type': 'website',
    'og:url': `${origin}${location.pathname}`,
    'og:title': `${eventItem.title}`,
    'og:description': `${eventItem.dateStart} - ${eventItem.subtitle}`,
    'og:image': `${origin}${typeData.imageUrl}`,
    'og:image:type': 'image/jpg',
  }
}
