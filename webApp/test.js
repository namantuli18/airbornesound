const express = require('express');
const app = express();
const path = require("path");
const PORT=5000
app.use(express.urlencoded({ extended: true }));
// const nunjucks=require('nunjucks')
// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });
app.get("/", (req, res, next) => {
	 res.render('index.html');
	});
app.listen(PORT, function () {
    console.log('Express server listening on port ', PORT);
});