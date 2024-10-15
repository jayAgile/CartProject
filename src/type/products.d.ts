// Define the Product type
interface ProductItem {
  product_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock_quantity: number;
  image_url?: string; // Optional property for image URL
}
