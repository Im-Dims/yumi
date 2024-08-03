export default {
  name: 'facebook',
  tags: 'download',
  command: ['facebook', 'fb'],
  description: 'Downloading video facebook',
  example: Func.example('%p', '%cmd', 'https://www.facebook.com/100010929794713/posts/1885825845125057'),
  limit: true,
  run: async(m, { sock, args }) => {
    if (!args[0].match('facebook.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {
        let res = await scrap.fbDl(args[0]);
        sock.sendMessage(m.chat, { video: { url: anu.result[0].url }, caption: `• *Fetching* : ${((new Date - old) * 1)} ms` },{ quoted: m })
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}