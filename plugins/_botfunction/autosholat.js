export async function before(m) {
    this.autosholat = this.autosholat ? this.autosholat : {}
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender
    let id = m.chat
    if (id in this.autosholat) {
        return false
    }
    //let data = await (await fetch('https://api.aladhan.com/v1/timingsByCity?city=Makassar&country=Indonesia&method=8')).json();
    //let jadwalSholat = data.data.timings;
    let jadwalSholat = {
        Shubuh: '04:49',
        Dhuhur: '12:06',
        Ashar: '16:18',
        Maghrib: '18:08',
        Isha: '18:50'
    }
    const date = new Date((new Date).toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta'
    }));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
        if (timeNow === waktu) {
            let caption = `Hi bro @${who.split`@`[0]},\nTime *${sholat}* has arrived, take ablution water and immediately pray🙂.\n\n*${waktu}*\n_for the East Java region and surrounding areas._`
            this.autosholat[id] = [
                this.reply(
                    m.chat,
                    caption,
                    null, {
                        contextInfo: {
                            mentionedJid: [who]
                        },
                    },
                    { mentions: m.metadata.participants.map((a) => a.id) }
                ),
                setTimeout(() => {
                    delete this.autosholat[id]
                }, 57000)
            ]
        }
    }
}
export const disabled = false
