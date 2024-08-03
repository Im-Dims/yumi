export default {
  name: 'banchat',
  tags: 'owner',
  command: ['banchat'],
  description: 'Banchat chat in the group',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    m.reply("*Success* Banned Chat")
	db.chats[m.chat].isBanned = true
  } 
}