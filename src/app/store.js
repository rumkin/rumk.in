export function getJson(id) {
  const script = document.getElementById(id)
  if (script) {
    try {
      return JSON.parse(
        decodeEntities(script.textContent)
      )
    }
    catch (err) {
      throw new Error(`Invalid store "${id}": ${err}`)
    }
  }
  else {
    throw new Error(`Store "${id}" not found`)
  }
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
