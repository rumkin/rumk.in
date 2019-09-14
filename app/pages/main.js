const {h} = require('hyperapp');

const {dilute} = require('../helpers/list');
const {flatten} = require('../helpers/list');

const props = (title, children) => h('dl', {class: 'projectProps'}, [
  h('dt', {class: 'projectProps-key'}, `${title}`),
  h('dd', {class: 'projectProps-value'}, children),
]);

const projectList = (prop) => (
  h('ul', prop, prop.projects.map((project, key) => (
    h('li', {key, class: 'projectList-item'}, [
      h('h3', {}, project.title),
      h('p', {}, project.intro),
      h('div', {}, [
        h('div', {class: 'projectList-itemLinks'}, flatten(project.links.map((link, key) =>
          [
            h('a', {
              key,
              href: link.url,
              class: 'projectList-itemLink',
            }, link.label),
            ' ',
          ]
        ))),
        ...projectProps(project),
      ]),
    ])
  )))
);

const logo = () => (
  h('img', {
    class: 'logo',
    src: '/assets/logo.png',
    width: '16',
    height: '16',
    alt: 'Logo',
  })
);

const projectProps = (project) => [
  props(
    'type',
    project.type,
  ),
  props(
    'env',
    dilute(project.env, ', '),
  ),
  props(
    'role',
    project.role,
  ),
  props(
    'state',
    project.state,
  ),
]

module.exports = ({mainPage}, actions) => {
  actions.setTitle('Paul Rumkin');

  return h('div', {class: 'container'}, [
    h('div', {class: 'hero'}, [
      h('h1', {}, [
        logo(),
        'Paul Rumkin',
      ]),
      h('p', {}, [
        'Software development for unix, web and ethereum. Contacts: ',
        h('a', {href: 'mailto:dev@rumk.in'}, 'dev@rumk.in'),
        ', ',
        h('a', {href: 'https://github.com/rumkin'}, 'github'),
        ', ',
        h('a', {href: 'https://twitter.com/rumkin'}, 'twitter'),
        '.',
      ]),
    ]),
    h('div', {class:'projects'}, [
      h('h2', {class:'projects-header'}, 'Projects'),
      h(projectList, {
        projects: mainPage.projects,
        class: 'projectList',
      }),
    ])
  ]);
};
