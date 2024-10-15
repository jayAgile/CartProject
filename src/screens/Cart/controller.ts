import {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {openDatabase} from '../../utils/productManager';
import {showSnackbar} from '../../utils/toast';

export const useCart = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    fetchFromCart();
    calculateTotalAmount();
  }, []);

  const productsList = useMemo(() => {
    return products?.map((product: ProductItem) => ({
      ...product,
      quantity: product.quantity || 1, // Set quantity to 1 if not provided
    }));
  }, [products]);

  useEffect(() => {
    calculateTotalAmount();
  }, [productsList]);

  // Fetch products from the cart and join with product details
  const fetchFromCart = async () => {
    setLoading(true);

    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          `SELECT *
         FROM Product 
         JOIN CART ON Product.product_id = Cart.product_id`, // Join with Cart table to fetch product details
          [],
          (_, results) => {
            const productsArray: ProductItem[] = [];
            for (let i = 0; i < results.rows.length; i++) {
              const item = results.rows.item(i);
              productsArray.push(item);
            }
            console.log('🚀 ~ fetchFromCart ~ productsArray:', productsArray);
            setProducts(productsArray); // Update the state with product details
            setLoading(false);
          },
          (_, err) => {
            showSnackbar('Failed to fetch products');
            setLoading(false);
            console.log('Error fetching products:', err.message);
          },
        );
      });
    } catch (err) {
      console.log('Error opening database:', err);
      showSnackbar('Database error occurred');
      setLoading(false);
    }
  };

  const calculateTotalAmount = async () => {
    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          `SELECT SUM(Cart.quantity * Product.price) AS totalAmount
       FROM Cart
       JOIN Product ON Cart.product_id = Product.product_id;`,
          [],
          (_, {rows}) => {
            if (rows.length > 0) {
              const totalPrice = rows.item(0).totalAmount;
              console.log('Total Amount:', totalPrice);
              setTotalAmount(totalPrice);
            }
          },
          (_, error) => {
            console.log('Error calculating total amount:', error.message);
          },
        );
      });
    } catch (error) {
      console.log('Error calculating total amount:', error);
    }
  };

  // Function to update product quantity in the database while adding
  const addQtyInCart = async (productItem: ProductItem) => {
    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Cart SET quantity = quantity + 1 WHERE product_id = ?',
          [productItem.product_id],
          async () => {
            fetchFromCart();
            console.log(
              `Quantity increased in Cart for product_id ${productItem.product_id}`,
            );
          },
          (_, error) => {
            console.error('Error increasing quantity in Cart:', error.message);
          },
        );
      });
    } catch (error) {
      console.log('🚀 ~ addQtyInCart ~ error:', error);
      showSnackbar('Error accessing database');
    }
  };

  // Function to update product quantity in the database when removing
  const removeQtyInCart = async (productItem: ProductItem) => {
    try {
      const db = await openDatabase();
      db.transaction(tx => {
        if (productItem.quantity > 1) {
          // If quantity > 1, reduce quantity by 1
          tx.executeSql(
            'UPDATE Cart SET quantity = quantity - 1 WHERE product_id = ?',
            [productItem.product_id],
            async () => {
              await fetchFromCart();
              console.log(
                `Quantity decreased in Cart for product_id ${productItem.product_id}`,
              );
            },
            (__, error) => {
              console.error(
                'Error decreasing quantity in Cart:',
                error.message,
              );
            },
          );
        } else {
          // If quantity <= 1, remove the product from the cart
          tx.executeSql(
            'DELETE FROM Cart WHERE product_id = ?',
            [productItem.product_id],
            async () => {
              await fetchFromCart();
              console.log(
                `Product removed from Cart for product_id ${productItem.product_id}`,
              );
            },
            (_, error) => {
              console.error('Error removing product from Cart:', error.message);
            },
          );
        }
      });
    } catch (error) {
      console.error('Error accessing database:', error);
      showSnackbar('Error accessing database');
    }
  };

  // Function to check if promo code exists and apply discount based on a specific product
  const applyPromoCode = async (productItem: ProductItem, code: string) => {
    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT discount_value FROM PromoCode WHERE code = ?',
          [code],
          (_, {rows}) => {
            if (rows.length > 0) {
              const discount = rows.item(0).discount_value;
              console.log(
                `Promo code valid for product, discount: ${discount}%`,
              );

              // Get the specific product's price and quantity
              const productPrice = productItem.price || 0; // Ensure price is defined
              const productQty = productItem.quantity || 1; // Ensure qty defaults to 1

              // Calculate total amount for the specific product
              const productTotalAmount = productPrice * productQty;
              console.log('Product Total Amount:', productTotalAmount);

              // Calculate discount amount
              const discountAmount = (productTotalAmount * discount) / 100;
              const discountedProductAmount =
                productTotalAmount - discountAmount;

              // You can now update the total amount based on this product if needed
              // Here, we can choose to return or update the state with the discounted amount

              console.log(
                'Discounted Product Amount:',
                discountedProductAmount,
              );
              setTotalAmount(prevTotal => prevTotal - discountAmount); // Update total amount for the entire cart
              showSnackbar(
                'Promo code applied successfully You save ' + discountAmount,
              );
            } else {
              Alert.alert('Invalid promo code');
            }
          },
          (_, error) => {
            console.error('Error checking promo code:', error.message);
          },
        );
      });
    } catch (error) {
      console.error('Error accessing database:', error);
    }
  };

  return {
    productsList,
    products,
    loading,
    totalAmount,
    removeQtyInCart,
    addQtyInCart,
    applyPromoCode,
  };
};
