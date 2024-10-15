import React, { useEffect, useState } from 'react';
import { invoke, requestConfluence, view } from '@forge/bridge';


function App() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);  
  const [oldAPIUser, setOldAPIUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [accountID, setAccountID] = useState(null);

  useEffect(() => {
    invoke('getUser').then(setUser);
  }, []);

  useEffect(() => {
    invoke('getUserOldAPI').then(setOldAPIUser);
  }, []);

  useEffect(() => {
    invoke('getEmail').then(setData);
  }, []);


  useEffect(() => {
    const getContext = async() => {
      const context = await view.getContext();
      console.log('Context')
      console.log(context);
      setAccountID(context.accountId);
    }

  getContext();
  }, []);

  useEffect(() => {
    const getUserInfo = async() => {
      if(accountID) {
        let bodyData = `{
          "accountIds": [
            "${accountID}"
          ]
        }`;

        const response = await requestConfluence(`/wiki/api/v2/users-bulk`, {
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
          setEmail(data.results[0].email);
          setName(data.results[0].publicName);
        } else 
        { 
          console.log(response)
        }
      } else {
        console.log("accountID is null")
      }
  }

  getUserInfo();

  }, [accountID]);

  return (
    <div>
      <h3>Requesting data in front end</h3>
      <p>Hello {name ? name : 'Loading...'} : {email ? email : 'Loading...'} </p>
      
      <h3>Requesting data in back end via Resolver asApp</h3>
      <p>Email: {data ? data : 'Loading...'}</p>
      <p>Display Name: {user ? user : 'Loading...'}</p>

      <h3>Requesting data in back end via Resolver using v1 API</h3>
      <p>Email: {oldAPIUser ? oldAPIUser : 'Loading...'}</p>

    </div>
  );
}

export default App;
