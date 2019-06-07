const baseURL = 'http://10.192.106.31:8080/api'; // TODO : changer cela quand le backend sera en prod

const fetchAllLoraNodes = async () => {

  const url = baseURL + '/devices';

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const responseJson = await response.json();

  console.log(responseJson);

  return responseJson;
};

const addLoraNode = async (deviceID, description, deviceEUI) => {
  const url = baseURL + '/devices';

  body = JSON.stringify({
    deviceID,
    description,
    deviceEUI,
  });

  console.log(body)

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body
  })

  console.log(response)

  const responseJson = await response.json();

  console.log('new lora', responseJson)

  return responseJson;

}


export default { fetchAllLoraNodes, addLoraNode };
