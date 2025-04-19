// app/signup/page.tsx

'use client'
import { useState } from 'react'

export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })

        const data = await res.json()
        if (data.success) {
            setMessage('登録成功！ログインページへどうぞ')
        } else {
            setMessage(data.error ?? '登録に失敗したのだ…')
        }
    }

    return (
        <div>
            <h1>新規登録</h1>
            <input placeholder="ユーザー名" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSubmit}>登録する</button>
            <p>{message}</p>
        </div>
    )
}
