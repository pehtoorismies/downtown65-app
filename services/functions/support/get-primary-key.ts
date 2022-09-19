export const getPrimaryKey = (eventId: string) => {
  return {
    PK: `EVENT#${eventId}`,
    SK: `EVENT#${eventId}`,
  }
}
