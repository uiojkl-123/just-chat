import { useUserStore } from '@/stores/userStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useState } from 'react'

export const Login = () => {
  const [name, setName] = useState<string>('')

  const { setUser } = useUserStore()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUser({ name: name })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 flex flex-col gap-2">
        <div className="text-h4 text-medium">이름</div>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
        <Button disabled={!name} type="submit">
          입장
        </Button>
      </div>
    </form>
  )
}

export default Login
