import path from "path"
import chalk from "chalk"
import fs from "fs"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import moment from 'moment-timezone';
import { plugins } from "./lib/plugins.js";

const isNumber = x => typeof x === "number" && !isNaN(x)
const database = (new (await import("./lib/database.js")).default())
global.plugins = plugins;

export async function handler(sock, m, chatUpdate) {
    if (!m) return
    if (db == null) await database.write(db)
    try {
        m.exp = 0
        m.limit = false
        await (await import("./lib/schema.js")).default(m)
        //if (m.isBaileys) return
        if (!m.isOwner && db.settings.self) return
        if (db.settings.pconly && m.chat.endsWith("g.us")) return
        if (db.settings.gconly && !m.chat.endsWith("g.us")) return
        if (db.settings.autoread) sock.readMessages([m.key])
        
        if (m.isOwner) {
            if ([">", "=>"].some(a => m.body.toLowerCase().startsWith(a))) {
                let __dirname = func.path.dirname(fileURLToPath(import.meta.url))
                let require = createRequire(__dirname), _return = ""

                try {
                    _return = /await/i.test(m.text) ? eval("(async() => { " + m.text + " })()") : eval(m.text)
                } catch (e) {
                    _return = e
                }

                new Promise((resolve, reject) => {
                    try {
                        resolve(_return)
                    } catch (err) {
                        reject(err)
                    }
                })?.then((res) => m.reply(func.format(res)))?.catch((err) => m.reply(func.format(err)))
            }

            if (["$", "exec"].some(a => m.body.toLowerCase().startsWith(a))) {
              m.reply("*Executing . . . .*")
                try {
                    exec(m.text, async (err, stdout) => {
                        if (err) return m.reply(func.format(err))
                        if (stdout) return m.reply(func.format(stdout))
                    })
                } catch (e) {
                    m.reply(func.format(e))
                }
            }
        }

        m.exp += Math.ceil(Math.random() * 10)
        let user = db.users && db.users[m.sender]
        let isPrem = m.isOwner || user.premium

        for (let name in global.plugins) {
            let plugin = global.plugins[name]

            if (!plugin) continue
            if (typeof plugin.all === "function") {
                try {
                    await plugin.all.call(sock, m, { chatUpdate })
                } catch (e) {
                    console.error(e)
                }
            }

            if (typeof plugin.before === "function") {
                if (await plugin.before.call(sock, m, { chatUpdate }))
                continue
            }

            if (m.prefix) {
                let { args, command, text } = m
                let _quoted = m.isQuoted ? m.quoted : m
                let isAccept = Array.isArray(plugin.command) ? plugin.command.some(cmd => cmd === command) : false

                m.plugin = name
                if (!isAccept) continue
                if (m.chat in db.chats || m.sender in db.users) {
                    if (db.chats[m.chat]?.isBanned && !m.isOwner) return
                    if (db.users[m.sender]?.banned && !m.isOwner) return
                }

                if (plugin.owner && !m.isOwner) {
                    m.reply(global.status.owner)
                    continue
                }

                if (plugin.premium && !isPrem) {
                    m.reply(global.status.premium)
                    continue
                }

                if (plugin.group && !m.isGroup) {
                    m.reply(global.status.group)
                    continue
                }

                if (plugin.botAdmin && !m.isBotAdmin) {
                    m.reply(global.status.botAdmin)
                    continue
                }

                if (plugin.admin && !m.isAdmin) {
                    m.reply(global.status.admin)
                    continue
                }

                if (plugin.private && m.isGroup) {
                    m.reply(global.status.private)
                    continue
                }

                if (plugin.register && !user.registered) {
                    m.reply(global.status.reg)
                    continue
                }

                if (plugin.quoted && !m.isQuoted) {
                    m.reply(global.status.quoted)
                    continue
                }

                if (plugin.media && !_quoted.isMedia) {
                    if (typeof plugin.media === "Object" && plugin.media !== null) {
                        if (plugin.media.audio && !/audio|voice/i.test(_quoted.mime)) {
                            m.reply(global.status.audio)
                            continue
                        }

                        if (plugin.media.image && !/image/i.test(_quoted.mime)) {
                            m.reply(global.status.image)
                            continue
                        }

                        if (plugin.media.sticker && !/webp/i.test(_quoted.mime)) {
                            m.reply(global.status.sticker)
                            continue
                        }

                        if (plugin.media.video && !/video/i.test(_quoted.mime)) {
                            m.reply(global.status.video)
                            continue
                        }
                    } else {
                        m.reply("Reply media nya")
                        continue
                    }
                }

                m.isCommand = true
                if (plugin.loading) m.reply(global.status.loading)
                if (plugin.limit && user.limit < 1 && !isPrem) {
                    m.reply(global.status.limit)
                    continue
                }

                if (plugin.example && !text) {
                    m.reply(plugin.example.replace(/%p/gi, m.prefix).replace(/%cmd/gi, plugin.name).replace(/%text/gi, text))
                    continue
                }

                let extra = {
                    sock,
                    args,
                    isPrem,
                    command,
                    text,
                    chatUpdate
                }

                try {
                    await plugin.run(m, extra)
                    if (!isPrem) m.limit = plugin.limit || false
                } catch (e) {
                    console.error(e)
                    m.reply(func.format(e))
                } finally {
                    if (typeof plugin.after === "function") {
                        try {
                            await plugin.after.call(sock, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (m) {
            let now = + new Date
            let user, stats = db.stats, stat

            if (m.sender && (user = db.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            if (m.plugin) {
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total)) stat.total = 1
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last)) stat.last = now
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
                } else {
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }
        
        const cmd = (m.cmd = m.body && m.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase());
        const today = moment.tz("Asia/Jakarta").format("dddd, DD MMMM YYYY");
        if (!m.isBaileys && !m.fromMe) console.log(`📨 Message Info`);
			console.log(chalk.black(chalk.bgWhite(!m.cmd ? "" : "-")), 
			chalk.black(chalk.bgGreen(today) + "\n"),
			chalk.black(chalk.bgYellow("[ CMD ]")),
			chalk.black(chalk.bgBlue(m.body || m.mtype)) + "\n" +
			chalk.cyan("- From : "),
			chalk.cyan(m.pushName),
			chalk.cyan("- In : "),
			chalk.cyan(m.chat),
			chalk.cyan("- Message ID : "),
			chalk.cyan(m.key.id),
			chalk.cyan(m.isGroup ? m.pushName : "Private Chat", m.chat),
        );
    }
}

export async function participantsUpdate({ id, participants, action }) {
    if (db.settings.self) return
    if (db == null) await database.write(db)
    let chat = db.chats[id] || {}, ppuser
    let metadata = await sock.groupMetadata(id)    
    switch (action) {
        case "add":
        case "remove":
            if (chat.welcome) {
                for (let user of participants) {
                    try {
                      ppuser = await sock.profilePictureUrl(user, "image")
					} catch {
                      ppuser = "https://telegra.ph/file/04022fa475e4162862d8b.jpg"
					} finally {
                      let tekswell = `Hai *@${user.split("@")[0]}*\n\nSelamat datang di *${metadata.subject}!*\n\nSaya harap kamu betah disini dan jangan lupa untuk selalu mengikuti peraturan yang ada`  
                      let teksbye = `Sayonaraa @${user.split("@")[0]} 👋`
                    if (action == "add") {
                      sock.sendFThumb(id, global.set.wm, tekswell, ppuser, media.sgc, m)
                    } else if (action == "remove") {
                      sock.sendFThumb(id, global.set.wm, teksbye, ppuser, media.sgc, m)
                    }
                    }
                }
            }
            break
        case "promote":
        case "demote":
        	let tekspro = `Selamat @${participants[0].split("@")[0]} atas kenaikan pangkatnya di grup ${metadata.subject} 🥂`
        	let teksdem = `Sabar yaa @${participants[0].split("@")[0]} atas penurunan pangkatnya di grup ${metadata.subject} 😔`
            if (chat.detect) {
              if (action == "promote") sock.sendMessage(id, { text: tekspro, mentions: [participants[0]] })
              if (action == "demote") sock.sendMessage(id, { text: teksdem, mentions: [participants[0]] })
            }
        break
    }
}

export async function groupsUpdate(groupsUpdate) {
    if (db.settings.self) return
    for (let groupUpdate of groupsUpdate) {
        let id = groupUpdate.id
        let chats = db.chats[id] || {}, text = ""
        if (!chats.detect) continue
        if (groupUpdate.desc) text = ("*Deskripsi grup telah diubah menjadi*\n\n@desc").replace("@desc", groupUpdate.desc)
        if (groupUpdate.subject) text = ("*Judul grup telah diubah menjadi*\n\n@subject").replace("@subject", groupUpdate.subject)
        if (groupUpdate.icon) text = "*Ikon grup telah diubah*"
        if (groupUpdate.inviteCode) text = ("*Tautan grup telah diubah menjadi*\n\nhttps://chat.whatsapp.com/@revoke").replace("@revoke", groupUpdate.inviteCode)
        if (groupUpdate.announce === true) text = "*Grup telah ditutup*"
        if (groupUpdate.announce === false) text = "*Grup telah dibuka*"
        if (groupUpdate.restrict === true) text = "*Grup dibatasi hanya untuk peserta saja*"
        if (groupUpdate.restrict === false) text = "*Grup ini dibatasi hanya untuk admin saja*"
        sock.sendMessage(id, { text })
    }
}

export async function presenceUpdate(presenceUpdate) {
  const id = presenceUpdate.id;
  const nouser = Object.keys(presenceUpdate.presences);
  const status = presenceUpdate.presences[nouser]?.lastKnownPresence;
  const user = global.db.users[nouser[0]];

  if (user?.afk && status === "composing" && user.afk > -1) {
    if (user.banned) {
      user.afk = -1;
      user.afkReason = "User Banned AFK";
      return;
    }

    const username = nouser[0].split("@")[0];
    const timeAfk = new Date() - user.afk;
    const caption = `@${username} berhenti afk, dia sedang mengetik\n\nAlasan: ${user.afkReason ? user.afkReason : "tidak ada alasan"}\nSelama: ${timeAfk.toTimeString()} yang lalu`;
    sock.sendMessage(id, { text: caption });
    user.afk = -1;
    user.afkReason = "";
  }
}

export async function rejectCall(json) {
  if (db.settings.anticall) {
    for (let id of json) {
      if (id.status === "offer") {
        let msg = await sock.sendMessage(id.from, { text: "Maaf untuk saat ini, Kami tidak dapat menerima panggilan, entah dalam group atau pribadi\n\nJika Membutuhkan bantuan ataupun request fitur silahkan chat owner" })
        sock.sendContact(id.from, global.owner, msg)
        await sock.rejectCall(id.id, id.from)
      }
    }
  }
}

//—————「 Don"t change it 」—————//
let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update handler.js"))
    import(`${file}?update=${Date.now()}`)
})
