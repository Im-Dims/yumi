export default {
  name: 'owner',
  tags: 'info',
  command: ['owner', 'creator'],
  description: 'Number of the owner or creator who created this bot',
  example: '',
  run: async(m, { sock }) => {
    sock.sendFThumb(m.chat, global.set.wm, "My Developer", "https://i.ibb.co/1ZR6BW8/76ff3abaceb93354dd61f50fcf4e236f.jpg", global.media.swa, m)
  }
}