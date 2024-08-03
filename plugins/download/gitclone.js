export default {
  name: 'gitclone',
  tags: 'download',
  command: ['gitclone', 'git'],
  description: 'Downloading the repository file from github',
  example: Func.example('%p', '%cmd', 'link github??'),
  limit: true,
  run: async(m, { sock, args }) => {
    let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    if (!regex.test(args[0])) return m.reply('Repositories tidak ditemukan')
    let [_, user, repo] = args[0].match(regex) || []
    repo = repo.endsWith('.git') ? repo.split('.git')[0] : repo
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`, fileName = (await func.axios.head(url)).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    sock.sendMessage(m.chat, { document: { url }, mimetype: 'application/zip', fileName }, { quoted: m })
  }
}