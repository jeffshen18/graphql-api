# Shopify Winter 2019 Backend Challenge 
For this task, I used GraphQL to design a server-side web API modelling the following relationship:
- Shops have many Products 
- Shops have many Orders
- Products have many Line Items
- Orders have many Line Items

## Setup

Clone this repo to your desktop and run `npm install` in the root directory to install all dependencies. 

Run `node app` to start the application and navigate to [http://localhost:3000/graphql](http://localhost:3000/graphql) to use the GraphiQL tool for API querying. 

## Usage

For the purpose of this challenge, I used mLab for hosting the database that the API will query from. 

The database is prepopulated with two Shops, two Orders, four Products and four Line Items.

## Operations

The following operations are examples that can be ran in the GraphiQL interface:

#### Queries

```
# Shops have many Products 
{
  shops{
    id
    name
    products{
      id
      name
      price
    }
  }
}
```
```
# Shops have many Orders
{
    shops {
    id
    name
    orders{
      id
    }
  }
}
```
```
# Products have many Line Items 
{
  products {
    id
    name
    lineitems{
      id
      quantity
      subtotal
    }
  }
}
```
```
# Orders have many Line Items 
{
  orders{
    id
    total
    lineitems{
      id
      quantity
      subtotal
      product{
        id
        name
        price
      }
    }
  }
}
```
#### Mutations
```
# Mutation to add a Shop
mutation {
  addShop(name: "Walmart") {
    id
    name
  }
}
```
```
# Mutation to add a Product
mutation {
  addProduct(name: "Poster", price: 15, shopId: "5b9ece583f5f560e8af5eb51") {
    id
    name
  }
}
```
```
# Mutation to add an Order
mutation {
  addOrder(shopId: "5b9ece583f5f560e8af5eb51") {
    id
  }
}
```
```
# Mutation to add a Line Item
mutation {
  addLineItem(orderId: "5ba86a472cab99af6dad5b0e", productId: "5b9ed656ffdc090fc4aa32f6" , quantity: 2  ) {
    quantity
  }
}
```

