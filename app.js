const express 		= require ('express');
const app 			= express();
const morgan 		= require('morgan');// morgan call next function if problem occure
const bodyParser 	= require('body-parser');// this package use to formate json data 
const mongoose 		= require ('mongoose');
app.use(bodyParser.json({limit: '100mb'}));
const globalVariable	= require("./nodemon.js");

const dbname = "location2";
global.JWT_KEY = "secret";


mongoose.connect('mongodb://localhost/'+globalVariable.dbname,{
	useNewUrlParser: true,
})
mongoose.promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});


const CountriesUrl 	= 	require("./api/routes/countries");
const StatesUrl 	= 	require("./api/routes/states");
const DistrictUrl 	= 	require("./api/routes/districts");
const BlocksUrl 	= 	require("./api/routes/blocks");
const CitiesUrl 	= 	require("./api/routes/cities");
const AreasUrl 		= 	require("./api/routes/areas");
const SubAreasUrl 	= 	require("./api/routes/subareas");
const SocietiesUrl 	= 	require("./api/routes/societies");

app.use("/api/countries",CountriesUrl);
app.use("/api/states",StatesUrl);
app.use("/api/districts",DistrictUrl);
app.use("/api/blocks",BlocksUrl);
app.use("/api/cities",CitiesUrl);
app.use("/api/areas",AreasUrl);
app.use("/api/subareas",SubAreasUrl);
app.use("/api/societies",SocietiesUrl);

app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
			error: {
			message: error.message
			}
		});
});

module.exports = app;