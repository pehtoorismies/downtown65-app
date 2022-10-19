import type { MetaFunction } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { useEffect } from 'react'
import invariant from 'tiny-invariant'
import { Constants } from '~/constants'

export const meta: MetaFunction = () => {
  return {
    title: 'DT65 - Kirjautuminen onnistui',
  }
}

const LoginSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idToken = params.get(Constants.ID_TOKEN)
    invariant(idToken, 'IdToken missing')
    jwtDecode<JwtPayload>(idToken)
    localStorage.setItem(Constants.ID_TOKEN, idToken)
    navigate('/')
  }, [])

  return <></>
}

export default LoginSuccess
