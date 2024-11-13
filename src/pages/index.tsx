'use client'

import Login from '@/components/Login'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSocketStore } from '@/stores/socketStore'
import { useUserStore } from '@/stores/userStore'
import { IMessage } from '@/types/chat'
import { timeToKoreanFormat } from '@/utils/time'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const Home = () => {
  const { socket, isConnected } = useSocketStore()
  const { user, setUser } = useUserStore()

  const scrollRef = useRef<HTMLDivElement>(null)

  const [isCurrentMessage, setIsCurrentMessage] = useState<boolean>(false)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState<string>('')

  const sendMessage = useCallback(async () => {
    if (currentMessage && user) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          user: user,
          content: currentMessage,
          date: new Date().toISOString(),
        }),
      })

      if (res.ok) setCurrentMessage('')
    }
  }, [currentMessage, user])

  useEffect(() => {
    socket?.on('message', (message: IMessage) => {
      setMessages((prev) => [...prev, message])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, scrollRef])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.addEventListener('scroll', () => {
        const scroll = scrollRef.current?.scrollTop ?? 0
        const height = scrollRef.current?.clientHeight ?? 0
        const scrollHeight = scrollRef.current?.scrollHeight ?? 0

        const isCurrent = scroll + height + 500 >= scrollHeight

        setIsCurrentMessage(isCurrent)
      })
    }
  }, [scrollRef.current])

  useEffect(() => {
    if (isCurrentMessage) {
      scrollToBottom()
    }
  }, [messages, isCurrentMessage])

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [scrollRef])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage()
  }

  const handleGetBeforeMessages = useCallback(async () => {
    const res = await fetch('/api/chat', {
      method: 'GET',
    })

    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }, [])

  return user ? (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col h-screen">
        <div className="h-full overflow-scroll" ref={scrollRef}>
          <div className="h-fit">
            <div className={'flex flex-col gap-1 p-5 '}>
              {messages.map((v, index, arr) => {
                return (
                  <div
                    className={
                      'flex w-full ' +
                      (v.user.name === user.name ? 'justify-end ' : '') +
                      (arr[index - 1]?.user.name === v.user.name
                        ? ' '
                        : 'mt-2 ')
                    }
                    key={index}
                  >
                    <div
                      className="flex flex-col gap-1"
                      style={{
                        maxWidth: '70%',
                        color: '#c0c0c0',
                        fontSize: '14px',
                      }}
                    >
                      <div className="flex">
                        {arr[index - 1]?.user.name !== v.user.name ? (
                          v.user.name === user.name ? (
                            <></>
                          ) : (
                            <div>{v.user.name}</div>
                          )
                        ) : undefined}
                      </div>
                      <div
                        className={
                          'flex gap-2 items-end ' +
                          (v.user.name === user.name
                            ? 'flex-row-reverse'
                            : 'flex-row')
                        }
                      >
                        <div
                          className="text-h5 white text-medium"
                          style={{
                            padding: '8px 12px',
                            backgroundColor:
                              v.user.name === user.name ? '#4378c8' : '#c0c0c0',
                            borderRadius: '12px',
                            color:
                              v.user.name === user.name ? 'white' : 'black',
                            fontSize: '16px',
                          }}
                        >
                          {v.content}
                        </div>
                        {arr[index + 1]?.user.name !== v.user.name ? (
                          <div
                            className=""
                            style={{
                              color: '#c0c0c0',
                              fontSize: '12px',
                              lineHeight: '12px',
                              alignSelf: 'flex-end',
                            }}
                          >
                            {timeToKoreanFormat(new Date(v.date))}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-2 text-white w-full bottom-0 h-fit relative">
          {!isCurrentMessage && (
            <div
              className="text-bold absolute top-[-20px] left-[50%] transform translate-x-[-50%] text-center cursor-pointer backdrop-blur-2xl p-2 rounded-lg bg-gray-900"
              style={{ color: '#d1d1d1' }}
              onClick={scrollToBottom}
            >
              아래로 스크롤
            </div>
          )}

          <div className="text-bold" style={{ color: '#00ff00' }}>
            {isConnected && '● 연결됨'}
          </div>

          <div className="text-h4 text-medium">이름: {user.name}</div>
          <Button onClick={handleGetBeforeMessages} kind="text" type="button">
            이전 메시지 불러오기
          </Button>
          <div className="flex flex-row gap-2">
            <Input
              required
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            ></Input>
            <Button
              disabled={!currentMessage}
              type="submit"
              style={{ width: '150px' }}
            >
              채팅
            </Button>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <Login />
  )
}
export default Home
