async function removeAllLikes(indicator) {
    likesInform = likesInform.bind(null, indicator);
    try {
        const myData = await req('users.get');
        const myId = myData[0].id;
        //собрать лайки на фото, видео, постах и удалить
        //удадить закладки людей и групп
    } catch (e) {
        if (e.message) console.error(e.message);
        if (e.stack) console.error(e.stack);
    }
}

function likesInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}