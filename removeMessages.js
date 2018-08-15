async function removeMessages(indicator) {
    const localMsgInform = msgInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
    let convOffset = 0;
    let friendsRemoved = 0;
    for (; ;) {
        const conversations = await req('messages.getConversations', {
            count: 100,
            offset: convOffset
        });
        if (conversations.items.length === 0) break;
        for (let n in conversations.items) {
            const conv = conversations.items[n];
            try {
                await req('messages.deleteConversation', {
                    user_id: myId,
                    peer_id: conv.conversation.peer.id,
                    count: 10000
                });
            } catch (e) {
                if (e.error.error_code === 9) {
                    return localMsgInform('Короче нас забанило по флуд контролю, нужно запустить попозже');
                    break;
                } else {
                    throw e;
                }
            }
            friendsRemoved++;
            localMsgInform('Удалено диалогов: ' + friendsRemoved);
        }
        convOffset += conversations.items.length;
    }
    localMsgInform('Все диалоги удалены!');
    await helpers.wait(1000);
}

function msgInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}