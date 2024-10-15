import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';


const resolver = new Resolver();

resolver.define('getUserOldAPI', async (req) => {
  console.log(req);
  const response = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`, {
    headers: {
      'Accept': 'application/json'
    }
  })

  if(response.status === 200) {
    let data = await response.json();
    console.log('getUser v1 API response')
    console.log(data);
    return(data.email)
  } else 
  { 
    console.log(response)
    return(response)
  }

})


resolver.define('getUser', async (req) => {
  console.log(req);
  console.log(req.context.accountId)

    if(req.context.accountId) {
      let bodyData = `{
        "accountIds": [
          "${req.context.accountId}"
        ]
      }`;

      const response = await api.asApp().requestConfluence(route`/wiki/api/v2/users-bulk`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyData
      });
      if(response.status === 200) {
        let data = await response.json();
        console.log(data);
        console.log(data.results[0].publicName);
        return(data.results[0].publicName);
      } else 
      { 
        console.log(response)
        return(response)
      }
    } else {
      console.log("accountId is null")
      return null;
    }
});

resolver.define('getEmail', async (req) => {
  console.log(req);
  console.log(req.context.accountId)

    if(req.context.accountId) {
      let bodyData = `{
        "accountIds": [
          "${req.context.accountId}"
        ]
      }`;

      const response = await api.asApp().requestConfluence(route`/wiki/api/v2/users-bulk`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyData
      });
      if(response.status === 200) {
        let data = await response.json();
        console.log(data);
        console.log(data.results[0].email);
        if(data.results[0].email === '') {
          return('email is hidden')
        }
        return(data.results[0].email);
      } else 
      { 
        console.log(response)
        return(response)
      }
    } else {
      console.log("accountId is null")
      return null;
    }
});

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();
