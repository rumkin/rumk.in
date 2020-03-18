export default class Compiler {
  compile(source, {filepath = ''} = {}) {
    return {
      errors: [],
      output: {
        head: {
          publishDate: new Date(),
        },
        body: [],
      },
    }
  }
}
