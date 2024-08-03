export default {
  name: 'twitter',
  tags: 'download',
  command: ['twitter', 'tw'],
  description: 'Downloading video twitter',
  example: Func.example('%p', '%cmd', 'https://twitter.com/harusakinodoka/status/1781337062123458571?t=V1z23ry142zqnCWemS42CA&s=19'),
  limit: true,
  run: async(m, { sock, args }) => {
    if (!args[0].match('twitter.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {
        let anu = await Func.fetchJson(API(ssa, '/api/twitter', { url: args[0] }))
        if (!anu.status) return m.reply(global.status.fail)
        sock.sendMessage(m.chat, { video: { url: anu.data.response.video_sd }, caption: `• *Fetching* : ${((new Date - old) * 1)} ms` },{ quoted: m })
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}