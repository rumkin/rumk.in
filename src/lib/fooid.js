export default function fooid(length = 12) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += (Math.random() * 32 | 0).toString(32)
  }
  return result
}
