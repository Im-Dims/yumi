export default {
  name: 'inspect',
  tags: 'owner',
  command: ['inspect', 'ip'],
  description: 'Inspect media newsletter channels',
  example: '',
  owner: false,
  run: async (m, { store }) => {
    const data = m.isQuoted ? m.quoted : m
    if (!data) return m.reply('Reply Messages!');
    const res = global.store.messages[m.chat].array.find(m => m.key.id === data.key.id)
    m.reply(JSON.stringify(res, null, 2))
  }
}