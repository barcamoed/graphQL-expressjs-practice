const graphQl = require('graphql');

const _ = require('lodash');

const Book = require('../models/Book');
const Author = require('../models/Author');

// Schema defines the object types, relations b/w those object
// types and how we can access graph to interact with data



// ---- To define new Object types ----//

const {GraphQLObjectType, GraphQLString,GraphQLSchema,GraphQLNonNull,GraphQLID,GraphQLInt,GraphQLList} = graphQl;


// BookType is an object type
const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                // console.log('Parentttttt',parent);
               return Author.findById(parent.authorId);
            }
        }
    })
});


const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType), // because we need list of all books bloging to particular author not just single book
            resolve(parent,args){
              //  return _.filter(books,{authorId:parent.id})
              return Book.find({authorId:parent.id});
            }
        }

    })
})


// Dummy Data
// var books = [{id:'1',name:'Book 1', genre:'mystery',authorId:"1"},
//             {id:'2',name:'Book 2', genre:'comedy',authorId:"2"},
//             {id:'3',name:'Book 3', genre:'horor',authorId:"3"},
//             {id:'4',name:'Book 4', genre:'biography',authorId:"2"},
//             {id:'5',name:'Book 5', genre:'horor',authorId:"3"},
//             {id:'6',name:'Book 6', genre:'comedy',authorId:"3"}];
// var authors = [{id:'1',name:'J.K Rowling', age:'20'},
//             {id:'2',name:'Shakespear', age:'25'},
//             {id:'3',name:'Brandon', age:'30'}
//         ];      

// Rip Queries are queries that are used to query data from graphql        
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}}, // will receive this id as argument to retrieve specific book
            resolve(parent,args){
            // this => resolve() method is used to fetch data from db or some other resource
            // return _.find(books,{id:args.id})
            return Book.findById(args.id)

            }

        },

        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
               // return _.find(authors,{id:args.id})
               return Author.findById(args.id)
            }
        },
        allBooks:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
              //  return books;
              return Book.find({})
            }
        },
        allAuthors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
              //  return authors;
              return Author.find({})
            }
        }    
        }
})


// Mutations in graphQL allows us to change data=>add, delete,update etc
// In graphq, we need to explicitly define our mutatons to saywhat data can be changed(added,deleted etc)

const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)}, // GraphQLNonNull is to make this field required i.e not null
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                let author = new Author({name:args.name,age:args.age});  // model Author()
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},
                authorId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorId:args.authorId
                });
                return book.save();
            }
        },
        removeBook:{
            type:BookType,
            args:{
                id:{type: GraphQLID}
            },
            resolve(parent,args){
                // console.log('Find By IDDD',args);
                return Book.findByIdAndDelete(args.id);
            }

        },
        updateBook:{
            type:BookType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                genre:{type:GraphQLString}
            },
            async resolve(parent,args){
             try {
                    const response = await Book.findByIdAndUpdate(args.id, { name: args.name, genre: args.genre }, { new: true });
                    // console.log('REsponseee ssss', response);
                    return response;
                } catch (error) {
                    console.log('Erroorrr', error);
                    return error;
                }
                
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query:RootQuery,
    mutation:Mutations
})