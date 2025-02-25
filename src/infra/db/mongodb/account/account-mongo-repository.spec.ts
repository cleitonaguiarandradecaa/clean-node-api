import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'
let accountCollection: Collection
describe('Repositório Mongo da Conta' , () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('contas')
    await accountCollection.deleteMany({})
  })
  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Deve retornar minha conta ao adicionar com sucesso' , async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name' ,
      email: 'qualquer_email@mail.com' ,
      password: 'qualquer_senha'
    })
    expect(account).toBeTruthy() // verifica se o valor não é false
    expect(account.id).toBeTruthy() // verifica se o valor não é false
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Deve retornar minha conta no sucesso de loadByEmail' , async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name' ,
      email: 'qualquer_email@mail.com' ,
      password: 'qualquer_senha'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy() // verifica se o valor não é false
    expect(account.id).toBeTruthy() // verifica se o valor não é false
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
  test('Deve retornar null se loadByEmail falhar' , async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy() // verifica que o valor não é false
  })

  test('Deve atualizar a conta accessToken no sucesso do updateAccessToken' , async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name' ,
      email: 'qualquer_email@mail.com' ,
      password: 'qualquer_senha'
    })
    const fakeAccount = res.ops[0]
    await sut.updateAccessToken(fakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({ _id: fakeAccount._id })
    expect(account).toBeTruthy() // verifica se o valor não é false
    expect(account.accessToken).toBe('any_token')
  })
})
