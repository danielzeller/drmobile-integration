Handlebars.registerHelper('ivyLiveImage', function(media) {
  var image = this.media.sizes.w1024h768;
  var result = '<img src="' + image.url + '" width="' + image.width + '" height="' + image.height + '" >';
  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('ivyLiveVideo', function(media) {
  var video = this.media.sizes.iphone;
  var result = '<source src="' + video.url + '" type="video/mp4" >';
  return new Handlebars.SafeString(result);
});

var Ivy = function(json, pageContentEl)
{
    this.json = json;
    this.el = pageContentEl;
    this.init();
};

Ivy.prototype.init = function()
{
    this.render();
    this.render_posts(this.json.posts);
    this.listen();
};

Ivy.prototype.render = function(pageContentEl)
{
    var source   = $("#live-template").html();
    var template = Handlebars.compile(source);
    var html     = template(this.json);
    $(this.el).append(html);
};

Ivy.prototype.render_posts = function(posts)
{
  var postsLength = posts.length;

  for (var i = 0; i < postsLength; i++) {
    this.render_post(posts[i]);
  }
};

Ivy.prototype.render_post = function(post)
{
  post.formattedTime = new Date(post.created).toLocaleTimeString();
  var source   = $("#post-template-"+post.postType).html();
  var template = Handlebars.compile(source);
  var html     = template(post);

  if ($("#" + post.id).length) {
    var divWidth = $("#" + post.id).width();
    var sizeKeys = Object.keys(post.media.sizes);
    var preDivHeight = sizeKeys[0].height / (sizeKeys[0].width / $("#" + post.id).width());
    $("#" + post.id).animate({ height: preDivHeight }, 1000);
    $("#" + post.id)[0].innerHTML = $(html)[0].innerHTML;
  } else {
    $("article").prepend(html);
    $("#" + post.id).show();
  }

  if (post.postType == "video") {
    this.addVideoListener(post.id);
  }

};

Ivy.prototype.addVideoListener = function(id){
  $('#video-' + id).on('click', function(){
    if (this.paused){
      this.play();
    } else {
      this.pause();
    }
  })
};

Ivy.prototype.listen = function()
{
  var pusher = new Pusher(this.json.pusherKey);
  var channel = pusher.subscribe(this.json.channel);

  console.log("in listen setup");
  console.log(this.json.pusherKey);
  console.log(this.json.channel);

  that = this;

  channel.bind('new_post', function(data) {
    console.log(data);
    that.render_post(data);
  });
};
