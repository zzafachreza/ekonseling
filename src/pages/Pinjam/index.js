import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { MyButton, MyGap } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { showMessage } from 'react-native-flash-message';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default function Pinjam({ navigation, route }) {
  const item = route.params;
  navigation.setOptions({
    headerShown: false,
  });


  const Bintang = ({ nilai }) => {
    var myBintang = [];

    for (let i = 0; i < 5; i++) {
      myBintang.push(
        <View key={i}>
          <Icon
            type="font-awesome"
            name="star"
            color={i < nilai ? '#F8B459' : '#C7C7C7'}
            style={{ marginHorizontal: 2 }}
            size={12}
          />
        </View>,
      );
    }

    return <>{myBintang}</>;
  };


  const isFocused = useIsFocused();

  const [jumlah, setJumlah] = useState(1);

  const [cart, setCart] = useState(0);
  const [user, setUser] = useState({});
  useEffect(() => {
    if (isFocused) {
      getData('user').then(res => {
        console.log('data user', res);
        setUser(res);
      });
    }
  }, [isFocused]);

  const modalizeRef = useRef();

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const addToCart = () => {
    const kirim = {
      fid_user: user.id,
      fid_konselor: item.id_konselor,

    };
    console.log('kirim tok server', kirim);
    axios
      .post(urlAPI + '/1add_cart.php', kirim)
      .then(res => {
        console.log(res);

        showMessage({
          type: 'success',
          message: 'Berhasil ditambahkan ke keranjang',
        });
        navigation.replace('MainApp');
        modalizeRef.current.close();
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          height: 50,
          // padding: 10,
          paddingRight: 10,
          backgroundColor: colors.primary,

          flexDirection: 'row',
        }}>
        <View style={{ justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon type="ionicon" name="arrow-back" color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
              color: colors.white,
            }}>
            {item.nama_lengkap}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <Image

          style={{
            height: windowHeight / 2,
            width: windowWidth
          }}
          source={{
            uri: item.image,
          }}
        />

        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
          }}>
          <View
            style={{
              padding: 10,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.primary,
              }}>
              {item.nama_lengkap}
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 20,
                color: colors.black,
              }}>
              {item.spesialisasi}
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 30,
                color: colors.black,
              }}>
              {item.wilayah}
            </Text>

            <View style={{
              flexDirection: 'row'
            }}>
              <View style={{
                flex: 1,
                marginVertical: 10,
                flexDirection: 'row'
              }}>
                <Bintang nilai={item.nilai_konselor} />
                <TouchableOpacity onPress={() => navigation.navigate('Pilihan', item)} style={{
                  paddingHorizontal: 5,
                  marginHorizontal: 5,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  paddingVertical: 2,
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 35,
                    color: colors.white,
                  }}>Lihat ulasan</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </View>

      <MyButton
        Icons="chatbubbles-outline"
        fontWeight="bold"
        radius={0}
        title="Konsultasi"
        warna={colors.primary}
        onPress={onOpen}
      />


      <Modalize
        withHandle={false}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        snapPoint={windowHeight / 4}
        HeaderComponent={
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>

              <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 20,
                    color: colors.black,
                  }}>
                  Konsultasi
                </Text>

              </View>
              <TouchableOpacity onPress={() => modalizeRef.current.close()}>
                <Icon type="ionicon" name="close-outline" size={35} />
              </TouchableOpacity>
            </View>
          </View>
        }

        ref={modalizeRef}>

        <View style={{
          height: windowHeight / 8,
          justifyContent: 'flex-end'
        }}>
          <View style={{
            flexDirection: 'row',
            padding: 10,
          }}>
            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/' + item.wa)} style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.success,
              padding: 10,
              marginRight: 5,
              borderRadius: 10,
            }}>
              <Icon type='ionicon' name='logo-whatsapp' color={colors.white} />
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.white,
              }} >ONLINE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/' + item.wa)} style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.border,
              padding: 10,
              marginLeft: 5,
              borderRadius: 10,
            }}>
              <Icon type='ionicon' name='logo-whatsapp' color={colors.white} />
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.white,
              }} >OFF ONLINE</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
