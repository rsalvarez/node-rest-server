//============================
//PORT 
//=============================

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGODB_URL;
}

//urlDB = 'mongodb+srv://strider:dhvKCf1dD0NAOu1D@cluster0.y1mdx.mongodb.net/Cafe?retryWrites=true&w=majority';

process.env.URLDB = urlDB;