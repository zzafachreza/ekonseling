import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [konselor, setKonselor] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {

    // const unsubscribe = messaging().onMessage(async remoteMessage => {

    //   const json = JSON.stringify(remoteMessage);
    //   const obj = JSON.parse(json);

    //   // console.log(obj);

    //   // alert(obj.notification.title)



    //   PushNotification.localNotification({
    //     /* Android Only Properties */
    //     channelId: 'ekonseling', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    //     title: obj.notification.title, // (optional)
    //     message: obj.notification.body, // (required)
    //   });
    // });

    getDataKategori();

    if (isFocused) {
      __getDataUserInfo();
    }
    // return unsubscribe;
  }, [isFocused]);


  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_konselor.php').then(res => {
      console.warn('data konselor', res.data);
      setKonselor(res.data)
    })
  }


  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);
      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;


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

  const __renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Pinjam', item);
      }}
      style={{
        borderRadius: 10,
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: colors.zavalabs2,

      }}>
      <View style={{
        flex: 0.3,
      }}>
        <Image source={{
          uri: item.image
        }} style={{
          alignSelf: 'center',
          // resizeMode: 'contain',
          width: '100%',
          height: 100,
          borderRadius: 10,

        }} />
      </View>

      <View style={{
        flex: 1,
        paddingLeft: 10,
      }}>
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.primary,
            fontFamily: fonts.secondary[600],
          }}>
          {item.nama_lengkap}
        </Text>
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.secondary,
            fontFamily: fonts.secondary[400],
          }}>
          {item.spesialisasi}
        </Text>
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.black,
            fontFamily: fonts.secondary[400],
          }}>
          {item.wilayah}
        </Text>
        <View style={{
          flexDirection: 'row',
          marginVertical: 10,
        }}>
          <Bintang nilai={item.nilai_konselor} />
        </View>
      </View>








    </TouchableOpacity >
  );


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      {/* header */}
      <View
        style={{
          height: windowHeight / 10,
          padding: 10,
          backgroundColor: colors.primary,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>


        <View style={{
          flexDirection: 'row'
        }}>
          <View style={{
            flex: 1,
          }}>
            <Text style={{
              color: colors.white,
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
            }}>Selamat datang, <Text style={{
              color: colors.white,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
            }}>{user.nama_lengkap}</Text></Text>
            <Text style={{
              color: colors.white,
              fontFamily: fonts.secondary[800],
              fontSize: windowWidth / 20,
            }}>Ekonseling Polda Sumbar</Text>
          </View>


          <View style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image source={require('../../assets/logo.png')} style={{
              width: 50, height: 50
            }} />
          </View>

        </View>


      </View>

      <ScrollView>
        <MyGap jarak={10} />
        <MyCarouser />

        {user.level == 'Konselor' && <View style={{
          marginVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>

          <TouchableOpacity onPress={() => navigation.navigate('AddLaporan', {
            tipe: 'BARU'
          })} style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              borderWidth: 1,
              borderColor: colors.zavalabs,
              borderRadius: 15,
              padding: 15
            }}>
              <Image style={{
                width: 50,
                height: 50,
                resizeMode: 'contain'
              }} source={require('../../assets/add.png')} />
            </View>

            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 25,
              marginTop: 10,
            }}>Laporan Baru</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AddLaporan', {
            tipe: 'LANJUTAN'
          })} style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              borderWidth: 1,
              borderColor: colors.zavalabs,
              borderRadius: 15,
              padding: 15
            }}>
              <Image style={{
                width: 50,
                height: 50,
                resizeMode: 'contain'
              }} source={require('../../assets/add2.png')} />
            </View>

            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 25,
              marginTop: 10,
            }}>Laporan Lanjutan</Text>
          </TouchableOpacity>

        </View>}

        {user.level == 'Konseli' && <>
          <View style={{
            padding: 10,
            marginTop: 0,
            flexDirection: 'row'
          }}>
            <Text style={{
              color: colors.primary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 25,
            }}>Konsultasi</Text>
            <View style={{
              flex: 1,
              paddingTop: 11,
            }}>
              <View style={{
                borderTopColor: colors.primary,
                marginHorizontal: 10,
                borderTopWidth: 1,
              }} />
            </View>
          </View>
          <View style={{
            flex: 1
          }}>


            <FlatList data={konselor} renderItem={__renderItem} />
          </View>
        </>}

      </ScrollView>

    </SafeAreaView>
  );
}
