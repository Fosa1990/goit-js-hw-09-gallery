import galleryItems from './app.js';
import refs from './refs.js';

refs.gallery.insertAdjacentHTML('afterbegin', createGalleryItem(galleryItems));

refs.gallery.addEventListener('click', onClickGalleryitem);

refs.modal.addEventListener('click', e => {
  if (e.target.dataset.action === 'prev-image') onPrevImage();
  if (e.target.dataset.action === 'next-image') onNextImage();
  if (
    e.target.classList.contains('lightbox__overlay') ||
    e.target.dataset.action === 'close-lightbox'
  )
    onCloseModal();
});

function createGalleryItem(items) {
  return items
    .map(
      ({ preview, original, description }) =>
        `<li class="gallery__item">
    <a class="gallery__link" href="${preview}">
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`,
    )
    .join('');
}

function onClickGalleryitem(e) {
  if (!e.target.classList.contains('gallery__image')) return;
  e.preventDefault();
  refs.modal.classList.add('is-open');
  setModalImageSrcAndAlt(e.target.dataset.source, e.target.alt);
  window.addEventListener('keydown', onKeyDown);
}

function setModalImageSrcAndAlt(src, alt) {
  refs.modalImage.src = src;
  refs.modalImage.alt = alt;
}

function onCloseModal() {
  refs.modal.classList.remove('is-open');
  setModalImageSrcAndAlt('', '');
  window.removeEventListener('keydown', onKeyDown);
}

function onKeyDown(e) {
  if (!refs.modal.classList.contains('is-open')) return;
  switch (e.code) {
    case 'Escape':
      onCloseModal();
      break;
    case 'ArrowLeft':
      onPrevImage();
      break;
    case 'ArrowRight':
      onNextImage();
      break;
  }
}

function onNextImage() {
  let currentImageIndex = findImageIndex(refs.modalImage.getAttribute('src'));
  if (currentImageIndex === galleryItems.length - 1) currentImageIndex = -1;
  setModalImageSrcAndAlt(
    galleryItems[currentImageIndex + 1].original,
    galleryItems[currentImageIndex + 1].description,
  );
}

function onPrevImage() {
  let currentImageIndex = findImageIndex(refs.modalImage.getAttribute('src'));
  if (currentImageIndex === 0) currentImageIndex = galleryItems.length;
  setModalImageSrcAndAlt(
    galleryItems[currentImageIndex - 1].original,
    galleryItems[currentImageIndex - 1].description,
  );
}

function findImageIndex(src) {
  return galleryItems.indexOf(galleryItems.find(el => el.original === src));
}
