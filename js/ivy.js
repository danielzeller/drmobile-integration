var Ivy = function(args)
{
    this.args = args;
    this.init();
};

Ivy.prototype.init = function()
{
    //this.args.json;
    this.render();
    this.listen();
};

Ivy.prototype.render = function()
{
    var source   = $("#live-template").html();
    var template = Handlebars.compile(source);
    var html     = template(this.args.json);
    $("body").append(html);
};

Ivy.prototype.listen = function()
{
  var pusher = new Pusher(this.args.json.pusher_key);
  var channel = pusher.subscribe(this.args.json.channel);
  var source = $("#live-template-post").html();
  var template = Handlebars.compile(source);

  channel.bind('new_post', function(data) {
    var html = template(data);
    $('.ivy-live table tbody').prepend(html)
  });
};
