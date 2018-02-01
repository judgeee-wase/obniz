var PeripheralIO_ = function(Obniz, id) {
  this.Obniz = Obniz;
};


PeripheralIO_.prototype.animation = function(name, status, array) {
  var obj = {};
  obj.io = {
    animation: {
      name: name,
      status: status
    }
  };
  if (!array)
    array = [];

  let states = [];
  for (var i=0; i<array.length; i++) {
    let state = array[i];
    let duration = state.duration;
    let func = state.state;

    // dry run. and get json commands
    this.Obniz.sendPool = [];
    func(i);
    let pooledJsonArray = this.Obniz.sendPool;
    this.Obniz.sendPool = null;

    // simply merge objects
    let merged = {};
    for (var index = 0; index < pooledJsonArray.length; index++) {
      for (let key in pooledJsonArray[index]) {
        merged[key] = pooledJsonArray[index][key];
      }
    }
    states.push({
      duration: duration,
      state: merged
    });
  }
  if(states.length > 0){
    obj.io.animation.states = states;
  }
//  console.log(obj.io.animation);
  this.Obniz.send(obj);
};