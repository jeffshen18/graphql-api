const graphql = require('graphql');
const _ = require('lodash');
const Shop = require("../models/shop");
const Product = require("../models/product");
const LineItem = require("../models/lineitem");
const Order = require("../models/order");

const { GraphQLObjectType,
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull
       } = graphql;

const ShopType = new GraphQLObjectType({
   name: 'Shop',
   fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       products: {
         type: new GraphQLList(ProductType),
         resolve(parent, args){
             return Product.find({shopId: parent.id});
         }
       },
       orders: {
         type: new GraphQLList(OrderType),
         resolve(parent, args) {
           return Order.find({shopId: parent.id});
         }
       }
   })
});


const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        price: { type: GraphQLInt },
        shop: {
          type: ShopType,
          resolve(parent, args){
              return Shop.findById(parent.shopId);
          }
        },
        lineitems: {
          type: new GraphQLList(LineItemType),
          resolve(parent, args){
              return LineItem.find({productId: parent.id});
          }
        },
    })
});

const LineItemType = new GraphQLObjectType({
    name: 'LineItem',
    fields: () => ({
        id: { type: GraphQLID },
        quantity: { type: GraphQLInt },
        subtotal: { type: GraphQLInt },

        product: {
          type: ProductType,
          resolve(parent, args){
              return Product.findById(parent.productId);
          }
        },
        order: {
          type: OrderType,
          resolve(parent, args){
              return Order.findById(parent.orderId);
          }
        }
    })
});


const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: ( ) => ({
        id: { type: GraphQLID },
        total: { type: GraphQLInt },
        shop: {
          type: ShopType,
          resolve(parent, args){
              return Shop.findById(parent.shopId);
          }
        },
        lineitems: {
          type: new GraphQLList(LineItemType),
          resolve(parent, args) {
            return LineItem.find({orderId: parent.id});
          }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        shop: {
          type: ShopType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              return Shop.findById(args.id);
          }
        },

        shops: {
          type: new GraphQLList(ShopType),
          resolve(parent, args) {
            return Shop.find({});
          }
        },

        product: {
          type: ProductType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              return Product.findById(args.id);
          }
        },

        products: {
          type: new GraphQLList(ProductType),
          resolve(parent, args) {
            return Product.find({});
          }
        },

        lineitem: {
          type: LineItemType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              return LineItem.findById(args.id);
          }
        },

        lineitems: {
          type: new GraphQLList(LineItemType),
          resolve(parent, args) {
            return LineItem.find({});
          }
        },

        order: {
          type: OrderType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              return Order.findById(args.id);
          }
        },
        orders: {
          type: new GraphQLList(OrderType),
          resolve(parent, args) {
            return Order.find({});
          }
        }
    }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {

    addShop: {
      type: ShopType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args) {
        let shop = new Shop({
          name : args.name
        });
        return shop.save();
      }
    },
    addProduct: {
      type: ProductType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(GraphQLInt)},
        shopId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        let product = new Product({
          name : args.name,
          price : args.price,
          shopId : args.shopId
        });
        return product.save();
      }
    },
    addLineItem: {
      type: LineItemType,
      args: {
        orderId: {type: new GraphQLNonNull(GraphQLID)},
        productId: {type: new GraphQLNonNull(GraphQLID)},
        quantity: {type: new GraphQLNonNull(GraphQLInt)}
      },
      async resolve(parent, args) {

        const productResult = await Product.findById(args.productId);
        let price = productResult.price;
        let subtotal = price*args.quantity;
        let lineitem = new LineItem({
          orderId : args.orderId,
          productId : args.productId,
          quantity : args.quantity,
          subtotal: subtotal
        });
        const orderResult = await Order.findById(args.orderId);
        orderResult.total += subtotal;
        orderResult.save();
        return lineitem.save();
      }
    },

    addOrder: {
      type: OrderType,
      args: {
        shopId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        let order = new Order({
          total: 0,
          shopId : args.shopId,
        });
        return order.save();
      }
    },
  }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
