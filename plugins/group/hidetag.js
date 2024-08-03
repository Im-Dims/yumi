export default {
  name: 'hidetag',
  tags: 'group',
  command: ['hidetag', 'h', 'everyone'],
  description: 'Tag all members in the group',
  example: Func.example('%p', '%cmd', 'Hi everyone'),
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock, text, participants }) => {
    sock.sendMessage(m.chat, { text: text, mentions: m.metadata.participants.map(a => a.id) }, { quoted: null })
  }
}