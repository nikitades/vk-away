async function removePhotos(indicator) {
    const localPhotoInform = photoInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
    await removeAlbums(myId, localPhotoInform);
    await removeSystemAlbumPhotos(myId, 'saved', localPhotoInform);
    await removeSystemAlbumPhotos(myId, 'wall', localPhotoInform);
    await removeSystemAlbumPhotos(myId, 'profile', localPhotoInform);
}

async function removeAlbums(myId, photoInform) {
    let albumsRemoved = 0;
    let albumsOffset = 0;
    for (; ;) {
        const albums = await req('photos.getAlbums', {
            owner_id: myId,
            count: 100,
            offset: albumsOffset
        });
        if (albums.items.length === 0) break;
        for (let n in albums.items) {
            const album = albums.items[n];
            await req('photos.deleteAlbum', {
                album_id: album.id
            });
            albumsRemoved++;
            photoInform('Удалено альбомов: ' + albumsRemoved);
        }
        albumsOffset += albums.items.length;
    }
    photoInform('Все альбомы удалены!');
    await helpers.wait(1000);
}

async function removeSystemAlbumPhotos(myId, albumCode, photoInform) {
    let photosRemoved = 0;
    let photosOffset = 0;
    for (; ;) {
        const photos = await req('photos.get', {
            owner_id: myId,
            album_id: albumCode,
            count: 100,
            offset: photosOffset
        });
        if (photos.items.length === 0) break;
        for (let n in photos.items) {
            const photo = photos.items[n];
            await req('photos.delete', {
                photo_id: photo.id,
                owner_id: myId
            });
            photosRemoved++;
            photoInform('Удалено фото из альбома ' + albumCode + ': ' + photosRemoved);
        }
        photosOffset += photos.items.length;
    }
    photoInform('Все фото из альбома ' + albumCode + ' удалены!');
    await helpers.wait(1000);
}

function photoInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}