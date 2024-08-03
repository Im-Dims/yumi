export default {
  name: 'unbanchat',
  tags: 'owner',
  command: ['unbanchat'],
  description: 'Unbanchat chat in the group',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    m.reply("*Success* Banned Chat")
	db.chats[m.chat].isBanned = false
  } 
}