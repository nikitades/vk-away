async function removeFromNewsComments(indicator) {
    newsCommentsInform = newsCommentsInform.bind(null, indicator);
    try {
        const myData = await req('users.get');
        const myId = myData[0].id;
        let superOffset = 0;
        for (; ;) {
            const comments = await req('newsfeed.getComments', {
                count: 100,
                start_time: helpers.getBigBangTime(),
                offset: superOffset
            });
            if (comments.items.length === 0) break;
            for (let i in comments.items) {
                let failed = false;
                const item = comments.items[i];
                switch (item.type) {
                    case 'topic':
                        await newsCommentsInform('Сейчас удаляем: комментарии к темам/беседам...', item.source_id);
                        await remove.myCommentsFromBoard(item.source_id, item.post_id, myId).catch(() => failed = true);
                        break;
                    case 'post':
                        await newsCommentsInform('Сейчас удаляем: комментарии в постах на стенах...', item.source_id);
                        await remove.myCommentsFromPost(item.source_id, item.post_id, myId).catch(() => failed = true);
                        break;
                    case 'photo':
                        await newsCommentsInform('Сейчас удаляем: комментарии к фотографиям...', item.source_id);
                        await remove.myCommentsFromPhoto(item.source_id, item.post_id, myId).catch(() => failed = true);
                        break;
                    case 'video':
                        await newsCommentsInform('Сейчас удаляем: комментарии к видео...', item.source_id);
                        await remove.myCommentsFromVideo(item.source_id, item.post_id, myId).catch(() => failed = true);
                        break;
                    case 'note':
                        await newsCommentsInform('Сейчас удаляем: комментарии к заметкам...', item.source_id);
                        await remove.myCommentsFromNote(item.source_id, item.post_id, myId).catch(() => failed = true);
                        break;
                }
                if (!failed) await req('newsfeed.unsubscribe', {
                    type: item.type,
                    owner_id: item.source_id,
                    item_id: item.post_id
                });
            }
            superOffset += 100;
        }
        indicator.innerText = 'Все данные из "новости" - "комментарии" удалены!';
        await helpers.wait('1000');
    } catch (e) {
        if (e.message) console.error(e.message);
        if (e.stack) console.error(e.stack);
    }
}

async function newsCommentsInform(element, text, id) {
    element.innerText = text;
    let info;
    if (helpers.isGroup(id)) {
        try {
            info = await req('groups.getById', {group_id: helpers.getGroupId(id)});
            info = info.name;
        }
        catch (e) {
        }
    } else {
        try {
            info = await req('users.get', {user_ids: id});
            info = info.first_name + ' ' + info.last_name;
        }
        catch (e) {
        }
    }
    if (info) element.innerText += (' -> ' + name);
}