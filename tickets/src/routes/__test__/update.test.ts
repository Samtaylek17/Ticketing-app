import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { requireAuth } from '@ticketty/common';

it('returns a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'fjfkh',
			price: 20,
		})
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'fjfkh',
			price: 20,
		})
		.expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'sjhjhdkl',
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'fjfjhf',
			price: 250,
		})
		.expect(401);
	expect(response.body.title).toEqual('sjhjhdkl');
	expect(response.body.price).toEqual(20);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'sjhjhdkl',
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'sgjhdd',
			price: -20,
		})
		.expect(400);
});

it('updates the ticket provided valid inputs', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'sjhjhdkl',
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100,
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResponse.body.title).toEqual('new title');
	expect(ticketResponse.body.price).toEqual(100);
});
