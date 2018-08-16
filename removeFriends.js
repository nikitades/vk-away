async function removeFriends(indicator) {
    const localFriendsInform = friendsInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
    await delFriends(localFriendsInform);
    await delSubs(localFriendsInform);
    localFriendsInform('Список друзей и ваших заявок в друзья очищен!');
    await helpers.wait(helpers.getSleepTime());
}

async function delFriends(localFriendsInform) {
    let offset = 0;
    let friendsRemoved = 0;
    for (; ;) {
        const friends = await req('friends.get', {
            count: 100,
            offset
        });
        if (friends.items.length === 0) break;
        for (let n in friends.items) {
            const friendId = friends.items[n];
            await req('friends.delete', {
                user_id: friendId
            });
            friendsRemoved++;
            localFriendsInform('Удалено друзяшек: ' + friendsRemoved);
        }
        offset += friends.items.length;
    }
}

async function delSubs(localFriendsInform) {
    let offset = 0;
    let subsRemoved = 0;
    for (;;) {
        const subs = await req('friends.getRequests', {
            count: 100,
            offset,
            out: true
        });
        if (subs.items.length === 0) break;
        for (let n in subs.items) {
            const subId = subs.items[n];
            await req('friends.delete', {
                user_id: subId
            });
        }
        subsRemoved++;
        localFriendsInform('Удалено заявок в друзья: ' + subsRemoved);
        offset += subs.items.length;
    }
}

function friendsInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}