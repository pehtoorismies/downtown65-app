export const successResponse = (payload: unknown) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }
}
