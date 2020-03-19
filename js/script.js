'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optActiveTagSelector = 'a.active[href^="#tag-"]';

/* function clickEvent() {
  event.preventDefault();
  const clickedElement = this;
} */

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  console.log('clicked element title Handler:', clickedElement);
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
  generateTitleLinks();
}

function generateTitleLinks(customSelector = ''){
  customSelector = '';
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log('custom selector:',customSelector);
  //console.log('articles generate title links:', articles);
  let html = '';
  for (let article of articles){
    const articleId = article.getAttribute('id');
    /* find the title element */

    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
  
}
generateTitleLinks();

function generateTags(){
  const articles = document.querySelectorAll(optArticleSelector);
  console.log('articles:',articles);
  for (let article of articles){
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTag = article.getAttribute('data-tags');
    const articleTagsArray = articleTag.split(' ');
    for(let tag of articleTagsArray){
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      html = html + linkHTML;
    }
    tagWrapper.innerHTML = html;
  }
}
generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('clicked element tag Handler:', clickedElement);
  const href = clickedElement.getAttribute('href');
  //console.log('href tag Handler:', href);
  const tag = href.replace('#tag-', '');
  //console.log('tag tag Handler:', tag);

  const activeTags = document.querySelectorAll(optActiveTagSelector);
  //console.log('active tags tag Handler:', activeTags);
  for (let activeTag of activeTags){
    activeTag.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log('tag links tCH',tagLinks);
  for (let tagLink of tagLinks){ 
    tagLink.classList.add('active');
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll('.list a');
  for(let tag of tags) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
  }
}
addClickListenersToTags();