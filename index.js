require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');

const app = express();

app.use(bodyParser.json());
app.post('/create', createAccount);

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server(process.env.HORIZON_ENDPOINT, {
	allowHttp: true
});

async function createAccount(req, res) {
	const sourceKeys = StellarSdk.Keypair.fromSecret(process.env.ROOT);
	const sourceAccount = await server.loadAccount(sourceKeys.publicKey());
	const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
		networkPassphrase: process.env.NETWORK_PASSPHRASE
	})
	  	.addOperation(StellarSdk.Operation.createAccount({
	      	destination: req.body.publicKey,
			startingBalance: '100'
	  	}))
		.setTimeout(30)
		.build()
	transasction.sign(process.env.ROOT);
	try {
		await server.submitTransaction(transaction)
		res.send({
			status: true
		})
	} catch (exception) {
		console.err(exception);
		res.send({
			status: false
		});
	}
}

app.listen(process.env.PORT, () => console.log(`Running on ${process.env.PORT}`));

