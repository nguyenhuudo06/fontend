const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const routes = require("./routes/index");
const cors = require('cors');
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;

// Middleware CORS để bật CORS cho tất cả các route
app.use(cors());

// Middleware body-parser để phân tích các phần thân request được định dạng JSON
app.use(bodyParser.json());

// Routes
routes(app);

// Kết nối cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// Lắng nghe các yêu cầu đến trên cổng được chỉ định
app.listen(port, () => {
    console.log('Sever is running in port: ', port);
})