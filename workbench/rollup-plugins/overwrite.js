import path from 'path'

export default function overwrite(modules) {
  const resolvedIds = new Map();

  Object.keys(modules).forEach((id) => {
    resolvedIds.set(path.resolve(id), modules[id]);
  });

  return {
    name: 'overwrite',

    resolveId(id, importer) {
      if (id in modules) return id;

      if (importer) {
        for (const search of normalize(id)) {
          const resolved = path.resolve(path.dirname(importer), search);
          if (resolvedIds.has(resolved)) {
            return resolved;
          }
        }
      }
    },

    load(id) {
			if (id in modules) {
				return modules[id]
			}
			else if (resolvedIds.has(id)) {
				return resolvedIds.get(id)
			}
    }
  };
}

function normalize(id) {
  if (id.endsWith('.js')) {
    return [id]
  }
  else {
    return [
      `${id}.js`,
      `${id}.jsx`,
      `${id}/index.js`,
      `${id}/index.jsx`,
    ]
  }
}
