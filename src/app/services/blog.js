export default function blog(config = {}) {
  return {
    async getPost(id) {
      if (id !== 'a' && id !== 'b') {
        return null
      }

      return {
        id,
        head: {
          title: `Post ${id}`,
        },
        body: ['This is a post.'],
      }
    },
    async countPosts() {
      return 2
    },
    async listPosts({
      offset = 0,
      limit = Infinity,
    } = {}) {
      return [
        await this.getPost('a'),
        await this.getPost('b'),
      ]
      .slice(offset, limit)
    }
  }
}
