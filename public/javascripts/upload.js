uploadImage.onchange = function (e) {
  var formData = new FormData()
  formData.append('file', e.target.files[0])
  axios.post('/uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    console.log(res.data.fileUrl)
    drawImage(res.data.fileUrl)
  })
}

function ImageOnLoad (src) {
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

async function drawImage (src) {
  var stage = new Konva.Stage({
    container: document.querySelector('.img-box'),
    width: 500,
    height: 500
  })
  var layer = new Konva.Layer()
  let image = await ImageOnLoad(src)
  var imageCanvas = new Konva.Image({
    image: image,
    x: 50,
    y: 50,
    width: 120,
    height: 120,
    draggable: true
  })
  layer.add(imageCanvas)
  stage.add(layer)
  stage.on('click tap', function (e) {
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

// class DrawImage {
//   constructor (src) {
//
//   }
// }
