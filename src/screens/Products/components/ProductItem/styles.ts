import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  productItem: {
    marginBottom: 16,
    padding: 16,
    marginHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
  },
  qtyContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    columnGap: 10,
  },
  qtyButton: {
    paddingHorizontal: 10,
    backgroundColor: 'grey',
  },
  qtyText: {
    fontSize: 20,
  },
  qtyNumber: {
    fontSize: 20,
  },
});
