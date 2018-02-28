const express = require('express');
const router = express.Router();
const db = require('../utility/postgres/pool');

router.get("/v1/get/:mallId", (req, res) => {
	db.connect(req.app.pool)
	.then(async (client) => {
		let result = await client.query('SELECT * FROM stores WHERE "mallId" IN ($1)', [req.params.mallId]);
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

router.get("/v1/search/:cityId", (req, res) => {
	//Tags should be self suffciant
	if(!req.query.tags) 
		return res.status(400).json({
			error: "Tags are required"
		})

	//Tags are comma separated string
	db.connect(req.app.pool)
	.then(async (client) => {
		let tags = req.query.tags.split(",");
		let likeQuery = ` LOWER(tags) LIKE LOWER('%${tags[0]}%')`;
		for(let i=1; i<tags.length; i++) {
			likeQuery += ` OR LOWER(tags) LIKE LOWER('%${tags[0]}%') `;
		}

		let result = await client.query(`SELECT * FROM stores WHERE ${likeQuery} AND "mallId" IN (SELECT "mallId" FROM malls WHERE "cityId"='${req.params.cityId}')`);
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