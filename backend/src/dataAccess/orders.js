import { Mongo } from "../database/mongo.js"
import { ObjectId } from "mongodb"


const collectionName = 'orders'

export default class OrdersDataAccess {
    async getOrders(){
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $lookup: { //olhe para
                    from: 'orderItems', // de
                    localField: '_id', // olhe para este campo
                    foreignField: 'orderId', // e junte com este campo
                    as: 'orderItems' // chame de 

                }
            },
            {
                $lookup: {
                    from: 'users', // de
                    localField: 'userId', // olhe para este campo
                    foreignField: '_id', // e junte com este campo
                    as: 'userDetails' // chame de 
                }
            },
            {
                $project: {
                    "userDetails.password": 0, // não traga a senha do usuário
                    "userDetails.salt": 0
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
            },
            {
                $group: {
                    _id: '$_id', // agrupa por id do pedido
                    userDetails: { $first: '$userDetails' }, // pega os detalhes do usuário
                    orderItems: { $push: '$orderItems' }, // agrupa os itens do pedido -- push pois é mais de um item
                    pickupStatus: { $first: '$pickupStatus' }, // pega o status de retirada
                    pickupTime: { $first: '$pickupTime' }, // pega o horário de retirada
                }
            }
        ])
        .toArray()

        return result
    }

    async getOrdersByUserId(userId){
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $match: { userId: new ObjectId(userId) } // filtra por userId
            },
            {
                $lookup: { //olhe para
                    from: 'orderItems', // de
                    localField: '_id', // olhe para este campo
                    foreignField: 'orderId', // e junte com este campo
                    as: 'orderItems' // chame de 

                }
            },
            {
                $lookup: {
                    from: 'users', // de
                    localField: 'userId', // olhe para este campo
                    foreignField: '_id', // e junte com este campo
                    as: 'userDetails' // chame de 
                }
            },
            {
                $project: {
                    "userDetails.password": 0, // não traga a senha do usuário
                    "userDetails.salt": 0
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
            },
            {
                $group: {
                    _id: '$_id', // agrupa por id do pedido
                    userDetails: { $first: '$userDetails' }, // pega os detalhes do usuário
                    orderItems: { $push: '$orderItems' }, // agrupa os itens do pedido -- push pois é mais de um item
                    pickupStatus: { $first: '$pickupStatus' }, // pega o status de retirada
                    pickupTime: { $first: '$pickupTime' }, // pega o horário de retirada
                }
            }
        ])
        .toArray()

        return result
    }

    async addOrder(orderData) {
        const { items, ...orderDataRest } = orderData

        orderDataRest.createdAt = new Date()
        orderDataRest.pickupStatus = 'Pending'
        orderDataRest.userId = new ObjectId(orderDataRest.userId)

        const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest)

        if(!newOrder.insertedId) {
            throw new Error('Order cannot be inserted')
        }

        items.map((item) => {
            item.plateId = new ObjectId(item.plateId)
            item.orderId = new ObjectId(newOrder.insertedId)
        })

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items)

        return result
    }

    async deleteOrder(orderId){

        const itemsToDelete = await Mongo.db
        .collection('orderItems')
        .deleteMany({ orderId: new ObjectId(orderId)})

        const orderToDelete = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) })

        const result = {
            itemsToDelete,
            orderToDelete
        }

        return result
    }

    async updateOrder (orderId, orderData){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: orderData }
            )

        return result
    }

}
