const baseURL = 'http://193.247.203.90:8080/api'; // TODO : changer cela quand le backend sera en prod

const fetchAllLoraNodes = async () => {
  const url = `${baseURL}/devices`;

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
  const url = `${baseURL}/devices`;

  const body = JSON.stringify({
    deviceID,
    description,
    deviceEUI,
  });
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body
    });

    console.log(response);

    const responseJson = await response.json();

    console.log('new lora', responseJson);
    return responseJson;
  } catch (err) {
    console.log('erreur');
    return null;
  }
};

export default { fetchAllLoraNodes, addLoraNode };
