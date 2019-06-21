var stage = null
var drawFlag = false
var rect = {
  x: 0,
  y: 0,
  zIndex: 1,
  width: 0,
  height: 0,
  stroke: 'blue',
  fill: 'transparent',
  strokeWidth: 2
}
var rectShpae = null
var drawsData = {
  'rect': [
  ]
}
uploadImage.onchange =async function (e) {
  var formData = new FormData()
  formData.append('file', e.target.files[0])
  let {data: {code, fileUrl}} = await axios.post('/uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  var image = await loadImage(fileUrl)
  stage = drawImage(image)
  stage.on('click tap', function (e) {
    var layer = stage.find('.drawLayer')
    console.log(layer)
    if (e.target === stage) {
      stage.find('Transformer').destroy()
      layer.draw();
      return
    }
    if (!e.target.hasName('img')) {
      return
    }
    stage.find('Transformer').destroy();
    var tr = new Konva.Transformer();
    layer.add(tr)
    tr.attachTo(e.target)
    layer.draw();
  })
}

function loadImage (src) {
  var image = new Image()
  image.src = src
  return new Promise((resolve, reject) => {
    image.onload = function () {
      resolve(image)
    }
    image.onerror = function (e) {
      reject(e)
    }
  })
}

function drawImage (image) {
  var stage = new Konva.Stage({
    container: document.querySelector('.img-box'),
    width: 500,
    height: 500
  })
  var layer = new Konva.Layer()
  layer.addName('drawLayer')
  var imageCanvas = new Konva.Image({
    image: image,
    x: 50,
    y: 50,
    name: 'img',
    width: 120,
    height: 120,
    draggable: true
  })
  layer.add(imageCanvas)
  stage.add(layer)

  return stage
}

document.getElementById('rect').addEventListener('click', drawRect, false)

function drawRect () {
  var image = stage.find('.img')
  var layer = stage.find('.drawLayer')
  image.draggable(false)
  layer.on('mousedown', function (e) {
    console.log(e)
    rect.x = e.evt.layerX
    rect.y = e.evt.layerY
    rect.name = 'rect'
    rectShpae = new Konva.Rect(
        rect
    )
    drawFlag = true
  })
  layer.on('mousemove',function (e) {
    if (drawFlag) {
      rect.width = e.evt.layerX - rect.x
      rect.height = e.evt.layerY - rect.y
      console.log('rect', e.evt.layerX, rect.x, e.evt.layerY, rect.y, rect.width, rect.height)
      rectShpae.setAttrs({
        width: rect.width,
        height: rect.height
      })
      var has = stage.find('.rect')
      console.log('has', has)
      var layer = stage.find('.drawLayer')
      if (has && has.length) {
        layer.draw()
      } else {
        layer.add(rectShpae)
        layer.draw()
      }
    }
  })
  layer.on('mouseup',function(e){
    console.log(e)
    drawFlag = false
  })
}
