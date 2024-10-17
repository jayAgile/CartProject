const BASE_URL = 'https://fakestoreapi.com/';

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}products`);
    const data = await response.json();
    console.log('Res:-', data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}products/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log('Res:-', data);
    return data;
  } catch (error) {
    console.error(error);
  }
};
