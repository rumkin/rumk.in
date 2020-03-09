export async function load(url) {
  const {default: add} = await import(url)
}
