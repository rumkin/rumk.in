export default function db(config = {}) {
  return {
    async get(key) {
      if (key !== 'blog:1' && key !== 'blog:2') {
        return null
      }

      return {
        title: `Page ${key}`,
        body: `
          This is a page
        `,
      }
    }
  }
}
