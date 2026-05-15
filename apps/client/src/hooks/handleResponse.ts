const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    console.error(data.error);
    console.log(data);

    throw new Error(`${data.error}`);
  }

  return data;
};

export default handleResponse;
