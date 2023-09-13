
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'; 
import { Notify } from 'notiflix/build/notiflix-notify-aio'; 
import { getImages } from './image'; 

const refs = {
    btnMore: document.querySelector('.load-more'),
    btnSearch: document.querySelector('.search-form button'),
    form: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
}

let query = '';
let page = 0;
let per_page = 40;
let totalPage = 1;

refs.btnMore.classList.add('visually-hidden');
refs.btnSearch.disabled = true;

refs.form.addEventListener('submit', onFormSubmit); 
refs.btnMore.addEventListener('click', onBtnSearch); 
refs.form.addEventListener('input', onFormInput);

const lightbox = new SimpleLightbox('.gallery a', { 
    captionsData: 'alt',
  });


function renderHtml({
    webformatURL,
    largeImageURL,
    likes,
    views,
    comments,
    downloads,
    tags,
}) {
    return `<div class="card">
        <a href=${largeImageURL}>
        <img class="foto" src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
        </a>
        <div class="text_block">
          <p class="about">
            <b> Likes </b>
            ${likes}
          </p>
          <p class="about">
            <b>Views </b>
            ${views}
          </p>
          <p class="about">
            <b>Comments </b>
            ${comments}
          </p>
          <p class="about">
            <b>Downloads </b>
            ${downloads}
          </p>
        </div>
      </div>`
}

function renderMarkup(image) {
  if (image && image.length > 0) {
    const markup = image.map(renderHtml).join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  }
}


function onFormInput(e) {
    e.preventDefault(); 
    refs.btnSearch.disabled = true;
  const userInput = e.target.value.trim();
  if (userInput !== '') {
    refs.btnSearch.disabled = false;
  }
}

refs.btnSearch.disabled = true;

async function onFormSubmit(e) { 
  e.preventDefault(); 
  refs.galleryEl.innerHTML = '';
  query = refs.form.elements.searchQuery.value.trim();
    try {
        let response = await getImages(page, query); 
      totalPage = Math.ceil(response.data.totalHits / per_page); 
        renderMarkup(response.data.hits); 

      if (response.data.total === 0) { 
        Notify.failure( 
          `Sorry, there are no images matching your search query. Please try again.`,  
          {
            timeout: 1000,
          }
        );
      }
      if (response.data.totalHits > 0) {  
        Notify.info(`Hooray! We found ${response.data.totalHits} images.`, { 
          timeout: 1000,
        });
        if (response.data.totalHits <= per_page) { 
          refs.btnMore.classList.add('visually-hidden'); 
        }else{
          refs.btnMore.classList.remove('visually-hidden');
          }
        }
    } catch (error) {
        Notify.failure(`Oops, something went wrong`);  
    }  
  lightbox.refresh(); 
}


function btnUpdate() {
     if (page === totalPage) {
         refs.btnMore.classList.add('visually-hidden');
         Notify.failure( 
          `We're sorry, but you've reached the end of search results.`,  
          {
            timeout: 1000,
          }
        );
  }
}

async function onBtnSearch() { 
  page += 1; 
    btnUpdate();
     
  try {
    const response = await getImages(page, query); 
    renderMarkup(response.data.hits);  
    const { height: cardHeight } =
      refs.galleryEl.firstElementChild.getBoundingClientRect(); 
    window.scrollBy({  
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notify.failure(`Oops, something went wrong`);
  }
}
