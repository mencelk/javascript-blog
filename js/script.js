'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optActiveLinkSelector = 'a.active',
  optArticleAuthorSelector = '.post-author';


function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const href = clickedElement.getAttribute('href');
  const article = document.querySelector(href);
  article.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(optTitleListSelector);
  console.log('custom selector:', customSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  /* Event listener */
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(allTags){
  const params = {};
  let min = 999999,
    max = 0;
  for (let tag in allTags) {
    const tagCount = allTags[tag];
    min = Math.min(min, tagCount);
    max = Math.max(max, tagCount);
  }
  params.min = min;
  params.max = max;
  console.log('Params:', params.min, params.max);
  return params;
}

function generateTags(){
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for (let tag of articleTagsArray) {
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      html = html + linkHTML;
      // eslint-disable-next-line no-prototype-builtins
      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  console.log('Tags Params:', tagsParams);
  let allTagsHTML = '';
  for (let tag in allTags) {
    allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ')' + '</a></li> ' ;
  }
  tagList.innerHTML = allTagsHTML;
  console.log('Tag List:', tagList);

  const tags = document.querySelectorAll('.tags a');
  for (let tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
generateTags();

function tagClickHandler(event){
  event.preventDefault();
  console.log('Tag was clicked.');
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTags = document.querySelectorAll(optActiveLinkSelector);
  for (let activeTag of activeTags) {
    activeTag.classList.remove('active');
  }
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll('.post-tags .list a');
  for (let tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
addClickListenersToTags();

function generateAutors(){
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const authorName = article.getAttribute('data-author');
    const postAuthor = 'by ' + authorName;
    authorWrapper.innerHTML = postAuthor;
  }
}
generateAutors();

function authorClickHandler(event) {
  event.preventDefault();
  console.log('Author was clicked.');
  const clickedElement = this;
  const authorName = clickedElement.querySelector('.author-name').innerHTML;
  const activeAuthors = document.querySelectorAll(optActiveLinkSelector);
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  clickedElement.classList.add('active');
  generateTitleLinks('[data-author="' + authorName + '"');
}

function addClickListenersToAuthors(){
  const authors = document.querySelectorAll('.authors a');
  for (let author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();

function clearFiltersClickHandler(event){
  event.preventDefault();
  console.log('Clear link was clicked.');
  const clearLinks = document.querySelectorAll(optActiveLinkSelector);
  for (let clearLink of clearLinks) {
    clearLink.classList.remove('active');
  }
  generateTitleLinks();
}

function addClickListenerToClear(){
  const clear = document.querySelector('.clear a');
  clear.addEventListener('click', clearFiltersClickHandler);
}
addClickListenerToClear();