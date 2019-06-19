var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadFile', function(req, res, next){
	var form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname, '../public/images')
	form.keepExtensions = true
	form.parse(req, function (err, fields, files){
		// console.log('files', files)
		let filePath = '';
		if (files.tmpFile) {
			filePath = file.tmpFile.path;
		} else {
			for (var key in files) {
				if (files[key].path && filePath === '') {
					filePath = files[key].path;
					break; // 取第一个文件路径
				}
			}
		}
		// 文件移动
		var targetDir = path.join(__dirname, '../public/upload');
		if (!fs.existsSync(targetDir)) {
			fs.mkdir(targetDir);
		}
		console.log(filePath)
		// 获取文件后缀
		var fileExt = filePath.substring(filePath.lastIndexOf('.'));
		// 判断文件类型是否允许上传
		if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
			var err = new Error('文件类型不允许上传');
			res.json({
				code: -1,
				message: '此文件类型不允许上传'
			});
		} else {
			var fileName = new Date().getTime() + fileExt;
			console.log('fileName', fileName);
			var targetFile = path.join(targetDir, fileName);
			// 移动文件
			fs.rename(filePath, targetFile, function (err) {
				if (err) {
					console.log(err);
					res.json({code: -1, message: '操作失败'});
				} else {
					var fileUrl = '/upload/' + fileName;
					res.json({
						code: 0,
						fileUrl: fileUrl
					});
				}
			});
		}
	})
});

module.exports = router;
