function heck(params) {
    let timeout = null;
    switch (params.type) {
        case 'photo':
        case 'video':
            timeout = 'big';
            break;
    }
    return req('likes.delete', params, undefined, undefined, timeout);
}

let localLikesInform;

async function removeAllLikes(indicator) {
    localLikesInform = likesInform.bind(null, indicator);
    try {
        await removePhotoLikes();
        await removeVideoLikes();
        await removePostLikes();
        await removeFavUsers();
        await removeFavLinks();
        // собрать лайки на фото, видео, постах и удалить
        // удадить закладки людей и групп
    } catch (e) {
        if (e.message) console.error(e.message);
        if (e.stack) console.error(e.stack);
    }
}

async function removePhotoLikes() {
    let offset = 0;
    let likesRemoved = 0;
    for (; ;) {
        const likes = await req('fave.getPhotos', {
            count: 100,
            offset: offset
        });
        if (likes.items.length === 0) break;
        for (let n in likes.items) {
            const like = likes.items[n];
            await heck({
                type: 'photo',
                owner_id: like.owner_id,
                item_id: like.id
            });
            likesRemoved++;
            localLikesInform('Удалено лайков с фото: ' + likesRemoved);
        }
        offset += likes.items.length;
    }
    localLikesInform('Все лайки с фото удалены!');
    await helpers.wait(helpers.getSleepTime());
}

async function removeVideoLikes() {
    let offset = 0;
    let likesRemoved = 0;
    for (; ;) {
        const likes = await req('fave.getVideos', {
            count: 100,
            offset: offset
        });
        if (likes.items.length === 0) break;
        for (let n in likes.items) {
            const like = likes.items[n];
            await heck({
                type: 'video',
                owner_id: like.owner_id,
                item_id: like.id
            });
            likesRemoved++;
            localLikesInform('Удалено лайков с видео: ' + likesRemoved);
        }
        offset += likes.items.length;
    }
    localLikesInform('Все лайки с видео удалены!');
    await helpers.wait(helpers.getSleepTime());
}

async function removePostLikes() {
    let offset = 0;
    let likesRemoved = 0;
    for (;;) {
        const likes = await req('fave.getPosts', {
            count: 100,
            offset: offset
        });
        if (likes.items.length === 0) break;
        for (let n in likes.items) {
            const like = likes.items[n];
            await heck({
                type: 'post',
                owner_id: like.owner_id,
                item_id: like.id
            });
            likesRemoved++;
            localLikesInform('Удалено лайков с постов: ' + likesRemoved);
        }
        offset += likes.items.length;
    }
    localLikesInform('Все лайки с постов удалены!');
    await helpers.wait(helpers.getSleepTime());
}

async function removeFavUsers() {
    let offset = 0;
    let usersRemoved = 0;
    for (;;) {
        const users = await req('fave.getUsers', {
            count: 100,
            offset: offset
        });
        if (users.items.length === 0) break;
        for (let n in users.items) {
            const user = users.items[n];
            await req('fave.removeUser', {
                user_id: user.id
            });
            usersRemoved++;
            localLikesInform('Удалено пользователей из закладок: ' + usersRemoved);
        }
        offset += users.items.length;
    }
    localLikesInform('Все пользователи удалены!');
    await helpers.wait(helpers.getSleepTime());
}

async function removeFavLinks() {
    let offset = 0;
    let linksRemoved = 0;
    for (;;) {
        const links = await req('fave.getLinks', {
            count: 100,
            offset: offset
        });
        if (links.items.length === 0) break;
        for (let n in links.items) {
            const link = links.items[n];
            await req('fave.removeLink', {
                link_id: link.id
            });
            linksRemoved++;
            localLikesInform('Удалено ссылок из закладок: ' + linksRemoved);
        }
        offset += links.items.length;
    }
    localLikesInform('Ссылки удалены!');
    await helpers.wait(helpers.getSleepTime());
}


function likesInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}