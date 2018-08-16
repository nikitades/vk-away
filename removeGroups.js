async function removeGroups(indicator) {
    const localGroupInform = msgInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
    let offset = 0;
    let groupsRemoved = 0;
    for (; ;) {
        const groups = await req('groups.get', {
            count: 100,
            offset: offset
        });
        if (groups.items.length === 0) break;
        for (let n in groups.items) {
            const groupId = groups.items[n];
            try {
                await req('groups.leave', {
                    group_id: groupId
                });
            } catch (e) {
                if (e.error.error_code === 9) {
                    return localGroupInform('Короче нас забанило по флуд контролю, нужно запустить попозже');
                    break;
                } else {
                    throw e;
                }
            }
            groupsRemoved++;
            localGroupInform('Удалено групп: ' + groupsRemoved);
        }
        offset += groups.items.length;
    }
    localGroupInform('Все группы удалены!');
    await helpers.wait(1000);
}

function msgInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}