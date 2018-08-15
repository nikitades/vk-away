async function removeFriends(indicator) {
    const localFriendsInform = friendsInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
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
    localFriendsInform('Список друзей очищен!');
    await helpers.wait(helpers.getSleepTime());
}

function friendsInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}