import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {DetailCountButton, ShippingMethodModal} from '../components';
import {
  ArrowBack,
  ArrowDown,
  CarShipping,
  Trash,
  Minus,
  Plus,
} from '../constants/icons';
import {COLORS} from '../constants';
import {BORDER_RADIUS, FONTS, SIZES} from '../constants/themes';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {
  addQty,
  removeFromCart,
  subQty,
} from '../redux/Shopping/Shopping-actions';

const ShopCart = ({
  route,
  cart,
  removeFromCart,
  handleAddQty,
  handleSubQty,
}) => {
  const arrIcon = 40;
  const trashIcon = 25;
  const navigation = useNavigation();

  let popupRef = React.createRef();

  const onShowPopup = () => {
    popupRef.show();
  };
  const onClosePopup = () => {
    popupRef.close();
  };

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = 0;

    cart.forEach((item) => {
      price += item.qty * item.harga;
    });

    setTotalPrice(price);
  }, [cart, totalPrice, setTotalPrice]);

  // --------------------------------------------- Render Products ---------------------------------------------
  const renderProducts = cart.map((value) => {
    const convertToRupiah = (angka) => {
      var rupiah = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
      return (
        'Rp. ' +
        rupiah
          .split('', rupiah.length - 1)
          .reverse()
          .join('')
      );
    };

    return (
      <View style={styles.cardContainer} key={value.id}>
        <View style={styles.imageContainer}>
          <Image source={{uri: value.icon}} style={styles.image} />
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.labeldetail}>{value.nama}</Text>

            <TouchableOpacity
              style={styles.miniDeleteButton}
              onPress={() => removeFromCart(value.id)}>
              <Trash width={trashIcon} height={trashIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailFooter}>
            {/* ------------------------------------ Handle Decrement ------------------------------------ */}
            <View style={styles.countContainer}>
              <TouchableOpacity
                style={styles.minus}
                onPress={() => handleSubQty(value.id, value.qty)}>
                <Minus />
              </TouchableOpacity>

              <Text style={styles.countValue}>{value.qty}</Text>
              {/* ------------------------------------ Handle Increment ------------------------------------ */}
              <TouchableOpacity
                style={styles.plus}
                onPress={() => handleAddQty(value.id, value.qty)}>
                <Plus />
              </TouchableOpacity>
            </View>

            <Text style={styles.valuePrice}>
              {convertToRupiah(value.harga)}
            </Text>
          </View>
        </View>
      </View>
    );
  });

  // ----------------------------------------- Common Render -----------------------------------------
  if (cart.length > 0) {
    const convertToRupiah = (angka) => {
      var rupiah = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
      return (
        'Rp. ' +
        rupiah
          .split('', rupiah.length - 1)
          .reverse()
          .join('')
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}>
            <ArrowBack width={arrIcon} height={arrIcon} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.deleteBtn}>
            <Text style={styles.labelDelete}>Hapus Semua</Text>
          </TouchableOpacity> */}
        </View>

        {/*----------------- Product -----------------*/}
        <ScrollView style={styles.productContainer}>
          {renderProducts}
        </ScrollView>

        {/*----------------- Modal -----------------*/}
        <ShippingMethodModal
          ref={(target) => (popupRef = target)}
          onTouchOutside={onClosePopup}
          title="Choose the type of delivery"
        />

        <View style={styles.footer}>
          {/*----------------- Trigger -----------------*/}
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.triggerModalContainer}
              onPress={onShowPopup}>
              <CarShipping width={24} height={24} />
              <Text style={styles.labelModal}>Type of Delivery</Text>
              <ArrowDown width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.footerBottom}>
            <View style={styles.footerPriceContainer}>
              <Text style={styles.labelFooterPrice}>Total Price</Text>
              <Text style={styles.valueFooterPrice}>
                {convertToRupiah(totalPrice)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.pembayaranBtn}
              onPress={() => navigation.navigate('PaymentMethod')}>
              <Text style={styles.labelPembayaran}>Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: FONTS.medium, fontSize: SIZES.h1}}>
          No Items in Your Cart
        </Text>
      </View>
    );
  }
};

const mapStateToProps = (state) => ({
  cart: state.shop.cart,
});

const mapDispatchToProps = (dispatch) => ({
  handleAddQty: (id, value) => dispatch(addQty(id, value)),
  handleSubQty: (id, value) => dispatch(subQty(id, value)),
  removeFromCart: (id) => dispatch(removeFromCart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopCart);

const deviceWidht = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 136,
    marginLeft: -18,
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: BORDER_RADIUS.small,
    transform: [{scale: 0.8}],
  },
  minus: {
    paddingHorizontal: 6.49,
    paddingVertical: 6.49,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: BORDER_RADIUS.default,
  },
  plus: {
    paddingHorizontal: 6.49,
    paddingVertical: 6.49,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: BORDER_RADIUS.default,
  },
  countValue: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 36,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 36,
  },
  productContainer: {
    paddingHorizontal: 22,
  },
  headerBtn: {
    backgroundColor: COLORS.white,
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.regular,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  miniDeleteButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 11,
    paddingVertical: 11,
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: BORDER_RADIUS.regular,
  },
  labelDelete: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.h3,
    textAlign: 'center',
    color: COLORS.white,
  },
  image: {
    width: deviceWidht * 0.14,
    height: deviceHeight * 0.08,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.greyLight2,
    paddingHorizontal: 13,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.default,
    alignItems: 'center',
    marginBottom: 15,
  },
  detailContainer: {
    justifyContent: 'space-between',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labeldetail: {
    width: deviceWidht * 0.5,
    fontFamily: FONTS.medium,
    fontSize: SIZES.body3,
    textAlign: 'left',
  },
  valuePrice: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body3,
    textAlign: 'center',
    color: COLORS.black,
  },
  footer: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: deviceHeight * 0.2,
    paddingHorizontal: 22,
    paddingTop: 36,
    shadowColor: '#000',
    shadowOffset: {
      width: 12,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 40,
  },
  triggerModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 217,
  },
  labelModal: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body3,
  },
  footerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerPriceContainer: {
    marginTop: 20,
  },
  labelFooterPrice: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body3,
  },
  valueFooterPrice: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body3,
  },
  pembayaranBtn: {
    paddingHorizontal: 34,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.verySmall,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  labelPembayaran: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.white,
  },
});
