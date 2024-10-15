import Snackbar from 'react-native-snackbar';

/*
  show Snack bar common function for validate with string value
*/
export const showSnackbar = (message: string) => {
  if (typeof message === 'string') {
    setTimeout(() => {
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_LONG,
        textColor: '#FFFF',
        backgroundColor: 'blue',
      });
    }, 400);
  }
};
