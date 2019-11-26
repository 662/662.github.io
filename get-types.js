const fetch = require('node-fetch')
const fs = require('fs')

fetch(`https://api.github.com/graphql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer 5e8ab06c960f4fe9bff86f87cebd7262110185ce`,
  },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    console.log(result)
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null
    )
    result.data.__schema.types = filteredData
    fs.writeFile(
      './src/configs/fragment-types.json',
      JSON.stringify(result.data),
      err => {
        if (err) {
          console.error('Error writing fragmentTypes file', err)
        } else {
          console.log('Fragment types successfully extracted!')
        }
      }
    )
  })
