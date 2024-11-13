export const timeToKoreanFormat = (time: Date) => {
  const now = new Date()

  const date = new Date(time)
  const year =
    date.getFullYear() !== now.getFullYear() ? `${date.getFullYear()}년` : ''
  const month =
    date.getMonth() + 1 !== now.getMonth() + 1 ? `${date.getMonth() + 1}월` : ''
  const day = date.getDate() !== now.getDate() ? `${date.getDate()}일` : ''
  const hour = date.getHours()
  const minute = `0${date.getMinutes()}`.slice(-2)
  const noon = hour < 12 ? '오전' : '오후'

  return `${year} ${month} ${day} ${noon} ${hour % 12}:${minute}`
}
