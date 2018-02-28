exports.connect = async (pool) => {
	const client = await pool.connect();
	return client;
}

exports.release = (client) => {
	client.release();
}