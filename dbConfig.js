var dbConnection;

if (process.env.MONGOHQ_URL) {
    dbConnection = process.env.MONGOHQ_URL;
}

else {
	dbConnection = "mongodb://localhost/Chorestr";
}

exports.dbConnection = dbConnection;