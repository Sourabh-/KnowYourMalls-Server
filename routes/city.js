const express = require('express');
const router = express.Router();
const db = require('../utility/postgres/pool');

router.get("/v1/get", (req, res) => {
	db.connect(req.app.pool)
	.then(async (client) => {
		let result = await client.query('SELECT * FROM cities');
		if(!result.rows.length)
			return res.status(204).json();
		res.status(200).json(result.rows);
		db.release(client);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
})

module.exports = router;