
require(['main', 'pages'], function(app, pages){
  "use strict";

  var pagesList;
  var keys = {
    nextArticle: [39],
    nextPage: [40].concat(['n', ' ', 'd', 's'].map(toCharCode)),
    prevArticle: [37],
    prevPage: [38].concat(['p', 'a', 'w'].map(toCharCode))
  };
  console.log(keys);
  var state = {
    article: 0,
    page: 0
  };

  function toCharCode (str) {
    return str.toUpperCase().charCodeAt();
  }

  function init(pagesData){
    pagesList = pagesData;
    console.log(pagesList);
    loadPage(state);

    document.onkeydown=changePageKeyboard;

  }


  function loadPage(state){
    console.log(state);
    if(!pagesList || !pagesList.items) {
      console.error('pagesList empty', pagesList);
      return;
    }
    app.event.trigger('renderPage',{
      json: pagesList.items[state.article].compiled.pages[state.page],
      assetsBaseUrl: pagesList.items[state.article].service.assetsBaseUrl
    });
  }

  function setNextPage(){
    console.log('set next page');
    if(pagesList.items[state.article].compiled.pages.length > state.page + 1){
        state.page = state.page + 1;
      }else if(pagesList.items.length > state.article + 1){
        state.article = state.article + 1;
        state.page = 0;
      }else {
        state = {
          article: 0,
          page: 0
        }
      }
  }

  function setPrevPage () {
    console.log('set prev page');
    if(state.page > 0){
      state.page = state.page -1;
    }else if(state.article > 0){
      state.article = state.article -1;
      state.page = pagesList.items[state.article].compiled.pages.length -1;
    }else {
      state = {
        article: pagesList.items.length - 1,
        page: pagesList.items[pagesList.items.length - 1].compiled.pages.length -1
      }
    }
  }

  function setNextArticle(){
    console.log('set next art');
    if(pagesList.items.length > state.article + 1){
      state.article = state.article + 1;
      state.page = 0;
    }else {
      state = {
        article: 0,
        page: 0
      }
    }
  }

  function setPrevArticle () {
    console.log('set prev art');
    if(state.article > 0){
      state.article = state.article -1;
      state.page = 0;
    }else {
      state = {
        article: pagesList.items.length - 1,
        page: 0
      }
    }
  }

  function changePageKeyboard(e){
    var button = e.keyCode;
    console.log(button, e, String.fromCharCode(e.keyCode));
    if(keys.nextPage.indexOf(button) > -1){
      setNextPage();
    }
    if(keys.prevPage.indexOf(button) > -1){
      setPrevPage();
    }
    if(keys.nextArticle.indexOf(button) > -1){
      setNextArticle();
    }
    if(keys.prevArticle.indexOf(button) > -1){
      setPrevArticle();
    }

    loadPage(state);

  }

  function changePageTouch (startY, endY, startX, endX) {
    var minTouch = 50;
    if(startY > endY && startY - endY > minTouch){
      setNextPage();
    }else if(endY > startY && endY - startY > minTouch){
      setPrevPage();
    }else if(startX > endX && startX - endX > minTouch){
      setNextArticle();
    }else if(endX > startX && endX - startX > minTouch){
      setPrevArticle();
    }
    loadPage(state);

  }

  function onTestPage(){
    var num ='[0-9]{1,3}';
    var dot = '\.';
    var ipRegex = [num, num, num, num].join(dot);
    if(window.location.hostname === "localhost"){
      return true;
    }
    if(window.location.hostname.match(ipRegex)){
      return true;
    }

    return false;
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

  if(onTestPage()){
    console.log('on test page!');
    // The name of the publication in LayoutPreview

     url = "http://aftenposten-staging.drlib.aptoma.no/drmobile.json?articleId=common408675&formatName=iphone";

    var env = getQueryVariable('env') ;
    var formatName = getQueryVariable('format') || 'iphone';
    var articleId = getQueryVariable('id') || 'ap6743515';
    state.page = getQueryVariable('page') || 0;
    var url;

    if(env && env =='staging'){
      url = "http://aftenposten-staging.drlib.aptoma.no/drmobile.json?"+
      "articleId="+articleId+
      "&formatName="+formatName;
    }else if(env && env =='sandbox'){
      url = "http://sandbox.drmobile.aptoma.no/drmobile.json?"+
      "articleId="+articleId+
      "&formatName="+formatName;
    }else{
      var publicationName = 'ap_pub_5';
      var url = 'http://rai-dev.aptoma.no:9000/drmobile.json?formatName=' + formatName
       + '&publicationName=' + publicationName
       + '&limit=20&order=updated+desc';
    }
    console.log('load from: ', url);

    pages.get({
      url: url,
      callback: init
    })

  }
});
