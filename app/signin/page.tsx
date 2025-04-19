'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async () => {
        const res = await signIn('credentials', {
            redirect: false,
            identifier,
            password,
        })

        if (res?.error) {
            setError(res.error)
        } else {
            router.push('/')  // ログイン後のリダイレクト先
        }
    }

    return (
        <div>
            <h2>ログイン</h2>
            <input placeholder="ユーザー名またはメール" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>ログイン</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
