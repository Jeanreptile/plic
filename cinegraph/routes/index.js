exports.index = function(req, res) {
  res.render('layout');
};

exports.partials = function(req, res, err) {
  if (req.params.name)
  {
    var name = req.params.name;
  }
  else
  {
    console.log("server siiide");
    var urlPath = req.url;
    var pieces = urlPath.split(/[\s/]+/);
    var name = pieces[pieces.length-1];
    console.log("NAME : " + name);
  }
  res.render(name);
};
