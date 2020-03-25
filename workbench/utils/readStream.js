export async function readStream(stream, encoding) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  const buffer = Buffer.concat(chunks)

  if (encoding) {
    return buffer.toString(encoding)
  }
  else {
    return buffer
  }
}
