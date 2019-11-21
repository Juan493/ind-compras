import Sequelize from 'sequelize';

import CONFIG from './config';

//DATABASE
// initialze an instance of Sequelize
const db = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
	host: CONFIG.db_host,
	dialect: CONFIG.db_dialect,
	port: CONFIG.db_port
});
// check the databse connection
db.authenticate()
	.then(() => {
		console.log('Connected to SQL database:', CONFIG.db_name);
	})
	.catch(err => {
		console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
	});

export default db;