const baseURL = 'http://heig-iot-backend.herokuapp.com';


const fetchAllVideoNodes = async (token) => {

  const url = baseURL + '/devices';

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'GET',
  });

  const responseJson = await response.json();

  return responseJson;
};

const addVideoNode = async (token, name, description, ip, publicKey) => {
  const url = baseURL + '/devices';

  body = JSON.stringify({
    name,
    description,
    ip,
    publicKey,
  });

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    method: 'POST',
    body
  })

  const responseJson = await response.json();

  return responseJson;
    
}

const runVideoNode = async (token, deviceIp) => {
  const url = baseURL + '/devices/next/' + deviceIp;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'GET',
  })

  const responseJson = await response.json();

  return responseJson;
    
}
 


export default { fetchAllVideoNodes, addVideoNode, runVideoNode };
