'use strict';

class Media {
  constructor() {
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeSrc = this.handleChangeSrc.bind(this);
    this.handleChangeLoop = this.handleChangeLoop.bind(this);
    this.handleChangeAutoplay = this.handleChangeAutoplay.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.createMedia = this.createMedia.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.createUniqId = this.createUniqId.bind(this);
    this.update = this.update.bind(this);

    this.listElement = document.querySelector('.media-list');
    this.addButtonElement = document.querySelector('.add-new-media');
    this.dropAreaElement = document.querySelector('.sidebar-content.media drop-area');

    this.dropAreaElement.addEventListener('drop', (e) => {
      uploadFile(e.target.files, 'media', (media) => {
        const newMedia = {
          id: media.name,
          src: media.src,
          type: media.type,
        }
        state.current.media.push(newMedia);
        this.createMedia(newMedia);
        this.update();
      }).then(() => {

      });
    });

    this.addButtonElement.addEventListener('click', () => {
      const newMedia = {
        id: this.createUniqId(),
        src: '',
        type: 'image',
      }
      state.current.media.push(newMedia);
      this.createMedia(newMedia);
      this.update();
    })
  }

  set() {
    state?.current.media.forEach(this.createMedia);
    this.update();
  }

  update() {
    state.save();
    const event = new Event('update');
    this.listElement.dispatchEvent(event);
  }

  getMediaById(id) {
    return state.current.media.find(media => media.id === id);
  }

  createUniqId(start) {
    const id = start || state.current.media.length;
    return (!!this.getMediaById(id.toString()) ? this.createUniqId(id + 1) : id).toString();
  }

  handleChangeId(e) {
    if (this.getMediaById(e.target.id)) {
      alert(`Media with id ${e.target.id} already exist!`);
      e.target.id = e.target._id;
    } else {
      this.getMediaById(e.target._id).id = e.target.id;
      e.target._id = e.target.id;

      this.update();
    }
  }

  handleChangeType(e) {
    this.getMediaById(e.target.id).type = e.target.type;
    this.update();
  }

  handleChangeSrc(e) {
    this.getMediaById(e.target.id).src = e.target.src;
    this.update();
  }

  handleChangeLoop(e) {
    this.getMediaById(e.target.id).loop = e.target.loop;
    this.update();
  }

  handleChangeAutoplay(e) {
    this.getMediaById(e.target.id).autoplay = e.target.autoplay;
    this.update();
  }

  handleDelete(e) {
    const id = e.target.id;
    if (confirm(`Are you sure you want to delete this media ${id}`)) {
      // const index = state.current.media.findIndex(media => media.id === id);
      // delete state.current[index];
      state.current.media = state.current.media.filter(media => media.id !== id);
      this.listElement.removeChild(e.target);
      this.update();
    }
  }

  createMedia(media) {
    const mediaItem = document.createElement('media-item');
    mediaItem.src = media.src;
    mediaItem.id = media.id;
    mediaItem._id = media.id;
    mediaItem.type = media.type;
    mediaItem.loop = media.loop;
    mediaItem.autoplay = media.autoplay;
    mediaItem.addEventListener('changeId', this.handleChangeId);
    mediaItem.addEventListener('changeSrc', this.handleChangeSrc);
    mediaItem.addEventListener('changeType', this.handleChangeType);
    mediaItem.addEventListener('changeLoop', this.handleChangeLoop);
    mediaItem.addEventListener('changeAutoplay', this.handleChangeAutoplay);
    mediaItem.addEventListener('delete', this.handleDelete);
    this.listElement.appendChild(mediaItem);
    return mediaItem;
  }
}

window.media = new Media();
