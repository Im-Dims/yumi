let handler = m => m
handler.before = async function (m) {
    let user = db.users[m.sender]                              
    if (new Date() - user.premiumTime > 0) {
            user.premiumTime = 0
            user.premium = true
        }
    }

export default handler