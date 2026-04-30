const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${data.error}`);
  }

  return data;
};

export default handleResponse;
