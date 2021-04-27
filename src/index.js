const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [
    {
        id: 'link-0',
        url: 'www.howtographql.com',
        description: 'Fullstack tutorial for GraphQL'
    },
    {
        id: 'link-1',
        url: 'www.santosfc.com.br',
        description: 'The biggest brazilian in the world'
    },
    {
        id: 'link-2',
        url: 'www.howtoreactnative.com',
        description: 'Fullstack tutorial for React Native'
    }
];

let idCount = links.length;

const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        feed: () => links,        
        link: (parent, { id }) => {
            for (let i = 0; i < links.length; i++) {
                if (links[i].id == id)
                    return links[i];
            }
            return null;        
        }
    },
    Mutation: {
        createLink: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link);
            return link;
        },
        updateLink: (parent, args) => {
            const index = links.findIndex(element => element.id === args.id);            
            if (index === -1)
                return null;

            const link = {
                id: args.id,
                description: args.description,
                url: args.url
            }
            links[index] = link;
            return link;
        },
        deleteLink: (parent, { id }) => {            
            const index = links.findIndex(element => element.id === id);            

            const linkRemoved = links.splice(index,1);
            return linkRemoved[0];        
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );