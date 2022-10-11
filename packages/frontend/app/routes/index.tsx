import { Link } from '@remix-run/react'

const index = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/auth/login">Login</Link>
        </li>
        <li>
          <Link to="/auth/signup">Signup</Link>
        </li>
        <li>
          <Link to="/auth/forgot-password">Forgot password</Link>
        </li>
      </ul>
    </div>
  )
}

export default index
