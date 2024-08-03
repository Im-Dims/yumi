export default {
  name: 'linkgroup',
  tags: 'group',
  command: ['linkgroup', 'linkgc', 'link'],
  description: 'Take the group link and share it with members',
  example: '',
  group: true,
  botAdmin: true,
  run: async(m, { sock }) => {
    m.reply("https://chat.whatsapp.com/" + await sock.groupInviteCode(m.chat))
  }
}