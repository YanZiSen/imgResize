uploadImage.onchange = function (e) {
  var formData = new FormData()
  formData.append('file', e.target.files[0])
  axios.post('/uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    console.log(res)
  })
}