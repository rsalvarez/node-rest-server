//============================
//PORT 
//=============================

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// TK end
// 60 * 60 * 24 * 30
process.env.CADUCA = 60 * 60 * 24 * 30;


// SEED

process.env.SEED = process.env.SEED || 'esta-semilla-desarrollo';


let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGODB_URL;
}


process.env.URLDB = urlDB;
process.env.CLIENT_ID = process.env.CLIENT_ID || "";