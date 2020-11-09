const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('Tests for user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'testUser', passwordHash })

        await user.save()
    })

    test('user creating succeeds with valid info', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const newUser = {
            username: 'tikibeni',
            name: 'Beni',
            password: 'salalasanala'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('user creating fails with too short username', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const newUser = {
            username: 'tk',
            password: '1234'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('is shorter than the minimum allowed length')
        const usersAtEnd = await helper.usersInDatabase()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user creating fails with too short password', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const newUser = {
            username: 'tkibeni',
            password: '12'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be atleast 3 characters long')

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user creating fails if username already exists', async () => {
        const usersAtStart = await helper.usersInDatabase()

        const newUser = {
            username: 'testUser',
            name: 'Valid Name+Password',
            password: '12345'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDatabase()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})