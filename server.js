var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Storage = {
  add: function(name) {
    var item = {
      name: name,
      id: this.setId
    };
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  delete: function(id) {
    this.items.splice(id, 1)
    return this.items;
  },
  update:function(name,id,targetIndex){
  if(targetIndex==-1){
   var item = {
      name: name,
      id: id
    }; 
    this.items.push(item);
    return this.items;
  }
  else{
    this.items[targetIndex].name=name;
  return this.items;
  }
  }
  
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
  response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
  if (!request.body) {
    return response.sendStatus(400);
  }
  var item = storage.add(request.body.name);
  response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {
  var id = parseInt(request.params.id);

  var targetIndex = storage.items.findIndex(function(value, index) {
    return value.id == id;
  });
  if (targetIndex == -1) {
    return response.sendStatus(404);
  }
  response.sendStatus(200);
  console.log(storage.delete(targetIndex));


});
app.put('/items/:id', jsonParser,function(request,response){
  var url_id=request.params.id;
  var id=request.body.id;
  var name=request.body.name;
  if(url_id!=id){
    return response.sendStatus(404);
  }
  
    var targetIndex = storage.items.findIndex(function(value, index) {
    return value.id == id;
  }); 
  // console.log(targetIndex);
  console.log(storage.update(name,id,targetIndex));
  response.sendStatus(200);
  
});

app.listen(process.env.PORT || 8080, process.env.IP);