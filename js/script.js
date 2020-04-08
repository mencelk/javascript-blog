/* eslint-disable no-prototype-builtins */
'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagsHb: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tags-cloud').innerHTML),
  authorList: Handlebars.compile(document.querySelector('#template-authors-list').innerHTML)
};

const opts = {
  tagSize: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  clearLink: '.clear a',
  all: {
    articles: '.post',
    activeLinks: 'a.active',
    authorsLinks: '.authors a',
  },
  article: {
    author: '.post-author',
    tags: '.post-tags .list',
    title: '.post-title',
    activeTitle: '.titles a.active',
    active: '.posts article.active',
  },
  author: {
    name: '.author-name',
  },
  listOf: {
    authors: '.authors',
    titles: '.titles',
    titlesLink: '.titles a',
    tags: '.tags',
    tagsLink: '.tags a',
    postTags: '.post-tags .list a',
  },
};
  
function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll(select.article.activeTitle);
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll(select.article.active);
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const href = clickedElement.getAttribute('href');
  const article = document.querySelector(href);
  article.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  let html = '';
  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(select.article.title).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  /* Event listener */
  const links = document.querySelectorAll(select.listOf.titlesLink);
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
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.tagSize.count - 1) + 1);
  const tagCloudClass = opts.tagSize.classPrefix + classNumber;
  return tagCloudClass;
}

function generateTags(){
  let allTags = {};
  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
    const tagWrapper = article.querySelector(select.article.tags);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for (let tag of articleTagsArray) {
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.articleTagsHb(linkHTMLData);
      html = html + linkHTML;
      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(select.listOf.tags);
  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = {tags: []};
  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  const tags = document.querySelectorAll(select.listOf.tagsLink);
  for (let tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTags = document.querySelectorAll(select.all.activeLinks);
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
  const tags = document.querySelectorAll(select.listOf.postTags);
  for (let tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
addClickListenersToTags();

function generateAuthors(){
  let allAuthorNames = {};
  const allAuthorsData = {authors: []};
  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
    const authorWrapper = article.querySelector(select.article.author);
    const authorName = article.getAttribute('data-author');
    if (!allAuthorNames.hasOwnProperty(authorName)) {
      allAuthorNames[authorName] = 1;
    } else {
      allAuthorNames[authorName]++;
    }
    const linkHTMLData = {author: authorName};
    const linkHTML = templates.articleAuthor(linkHTMLData);
    authorWrapper.innerHTML = linkHTML;
  }
  const authorList = document.querySelector(select.listOf.authors);
  for (let authorName in allAuthorNames) {
    console.log(authorName);
    allAuthorsData.authors.push({
      name: authorName,
      count: allAuthorNames[authorName],
    });
  }
  authorList.innerHTML = templates.authorList(allAuthorsData);
  console.log(allAuthorsData);
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const authorName = clickedElement.querySelector(select.author.name).innerHTML;
  const activeAuthors = document.querySelectorAll(select.all.activeLinks);
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  clickedElement.classList.add('active');
  generateTitleLinks('[data-author="' + authorName + '"');
}

function addClickListenersToAuthors(){
  const authors = document.querySelectorAll(select.all.authorsLinks);
  for (let author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();

function clearFiltersClickHandler(event){
  event.preventDefault();
  const clearLinks = document.querySelectorAll(select.all.activeLinks);
  for (let clearLink of clearLinks) {
    clearLink.classList.remove('active');
  }
  generateTitleLinks();
}

function addClickListenerToClear(){
  const clear = document.querySelector(select.clearLink);
  clear.addEventListener('click', clearFiltersClickHandler);
}
addClickListenerToClear();