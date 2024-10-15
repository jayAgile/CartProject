import {useEffect, useState} from 'react';

import {
  deleteAllProducts,
  insertProductData,
  insertPromoCodeData,
  openDatabase,
} from '../../utils/productManager';
import {NavigationProp, useNavigation} from '@react-navigation/native';

interface UseProductsPops {
  products: ProductItem[];
  loading: boolean;
  error: string | null;
  selectedProductList: ProductItem[];
  productsInCart: number | string;
  onAddToCartHandler: (product: ProductItem) => void;
  addProduct: () => void;
  deleteProduct: () => void;
  handleRefresh: () => void;
  navigateToMyCart: () => void;
}

/**
 * Custom hook to manage products data. It handles fetching products from
 * the database, adding a product, deleting all products, and refreshing
 * the products list.
 *
 * @returns An object containing the products data, a boolean indicating
 * whether the data is loading, an error message if something went wrong,
 * a function to add a product, a function to delete all products, and
 * a function to refresh the products list.
 */
export const useProducts = (): UseProductsPops => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductList, setSelectedProductList] = useState<ProductItem[]>(
    [],
  );

  // Usage example
  const addPromoCode = async () => {
    await insertPromoCodeData(
      'SAVE10',
      'percentage',
      10,
      100,
      '2024-10-01',
      '2024-10-31',
      1000,
    );
  };

  const navigation = useNavigation<NavigationProp<{MyCart: {}}>>();

  // Fetch products from the database
  const fetchProducts = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Product',
          [],
          async (tx, results) => {
            const productsArray = [];
            for (let i = 0; i < results.rows.length; i++) {
              productsArray.push(results.rows.item(i));
            }
            setProducts(productsArray);
            await fetchFromCart();
            setLoading(false);
            setSelectedProductList([]);
          },
          (tx, err) => {
            setError('Failed to fetch products');
            setLoading(false);
            console.log('Error fetching products:', err.message);
          },
        );
      });
    } catch (err) {
      setError('Database error occurred');
      setLoading(false);
      console.log('Error opening database:', err);
    }
  };

  // Fetch products from the cart and join with product details
  const fetchFromCart = async () => {
    // setLoading(true);
    // setError(null); // Reset error state before fetching

    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          `SELECT *
           FROM Product 
           JOIN CART ON Product.product_id = Cart.product_id`, // Join with Cart table to fetch product details
          [],
          (tx, results) => {
            console.log('results.rows.length', results.rows.length);
            const productsArray = [];
            for (let i = 0; i < results.rows.length; i++) {
              const item = results.rows.item(i);
              productsArray.push(item);
            }
            setSelectedProductList(productsArray); // Update the state with product details
            // setLoading(false);
          },
          (tx, err) => {
            setError('Failed to fetch products');
            // setLoading(false);
            console.log('Error fetching products:', err.message);
          },
        );
      });
    } catch (err) {
      // setError('Database error occurred');
      // setLoading(false);
      console.log('Error opening database:', err);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  // Handle refresh action
  const handleRefresh = () => {
    fetchProducts();
  };

  const addProduct = async () => {
    await insertProductData();
    await fetchProducts();
    await addPromoCode();
  };

  const deleteProduct = async () => {
    await deleteAllProducts();
    fetchProducts();
  };

  // Add selected products to the cart with total price calculation
  const addSelectedProductsToCart = async (product: ProductItem) => {
    const db = await openDatabase();

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Cart (product_id, quantity, added_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [product.product_id, 1], // Insert the correct quantity
        () => {
          fetchFromCart();
          console.log(`Product ${product.name} added to cart`);
        },
        (tx, error) => {
          console.log('Error adding product to cart:', error.message);
        },
      );
    });
  };

  const navigateToMyCart = async () => {
    navigation.navigate('MyCart', {});
  };

  // Products Added to cart Based on product Selection.
  const onAddToCartHandler = async (product: ProductItem) => {
    await addSelectedProductsToCart(product);
  };

  const productsInCart =
    selectedProductList.length > 0 ? selectedProductList.length : '';

  return {
    error,
    loading,
    products,
    productsInCart,
    selectedProductList,
    onAddToCartHandler,
    addProduct,
    deleteProduct,
    handleRefresh,
    navigateToMyCart,
  };
};
