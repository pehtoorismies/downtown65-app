import type { MetaFunction } from '@remix-run/node'
import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { useEffect } from 'react'
import invariant from 'tiny-invariant'

export const meta: MetaFunction = () => {
  return {
    title: 'DT65 - Kirjautuminen onnistui',
  }
}

const LoginSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idToken = params.get('idToken')
    invariant(idToken, 'IdToken missing')
    jwtDecode<JwtPayload>(idToken)
    localStorage.setItem('idToken', idToken)
  })

  return <h1>Success</h1>
}

export default LoginSuccess
