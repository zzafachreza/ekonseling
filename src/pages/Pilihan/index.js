import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { MyButton, MyGap, MyInput } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { showMessage } from 'react-native-flash-message';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { Rating, AirbnbRating } from 'react-native-ratings';
export default function Pilihan({ navigation, route }) {
  const [user, setUser] = useState({});

  useEffect(() => {

    getData('user').then(res => {
      console.log('data user', res);
      setUser(res);
      setKirim({
        ...kirim,
        fid_pemberi: res.id
      });
      getDataRating();
    });
  }, [])

  const [kirim, setKirim] = useState({
    fid_user: route.params.id_konselor,
    fid_pemberi: user.id,
    nilai: 0,
    info: ''

  })

  const [loading, setLoading] = useState(true);

  const sendServer = () => {
    setLoading(true);
    console.log('server sent', kirim);

    axios.post(urlAPI + '/1add_rating.php', kirim).then(res => {
      getDataRating();
    })
  }

  const getDataRating = () => {

    axios.post(urlAPI + '/1data_rating.php', {
      fid_user: route.params.id_konselor
    }).then(res => {
      setData(res.data);
      setLoading(false)
    })
  }

  const [data, setData] = useState(
    [
      {
        nama_lengkap: 'Diana Dewi',
        tanggal: '2 Februari 2022',
        info: 'Ibu terimakasih banyak mau mendengarkan cerita saya, ibu nya tidak pernah memotong pembicaraan saya, saya tidak sabar untuk next sesi lagi',
        nilai: 5,
      },
      {
        nama_lengkap: 'Diana Dewi',
        tanggal: '2 Februari 2022',
        info: 'Ibu terimakasih banyak mau mendengarkan cerita saya, ibu nya tidak pernah memotong pembicaraan saya, saya tidak sabar untuk next sesi lagi',
        nilai: 2,
      },
      {
        nama_lengkap: 'Diana Dewi',
        tanggal: '2 Februari 2022',
        info: 'Ibu terimakasih banyak mau mendengarkan cerita saya, ibu nya tidak pernah memotong pembicaraan saya, saya tidak sabar untuk next sesi lagi',
        nilai: 1,
      }
    ]
  );

  const __renderItem = ({ item }) => {
    return (
      <View style={{
        marginHorizontal: 5,
        marginVertical: 10,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: colors.zavalabs2,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          color: colors.primary,
          fontSize: windowWidth / 30
        }}>{item.nama_lengkap}</Text>
        <View style={{
          flexDirection: 'row',
          marginVertical: 5,
        }}>
          <View style={{
            flexDirection: 'row',
            marginRight: 10,
          }}>
            <Bintang nilai={item.nilai} />
          </View>
          <Text style={{
            fontFamily: fonts.secondary[400],
            color: colors.black,
            fontSize: windowWidth / 30
          }}>{item.tanggal}</Text>
        </View>
        <Text style={{
          fontFamily: fonts.secondary[400],
          color: colors.border,
          fontSize: windowWidth / 30
        }}>{item.info}</Text>
      </View>
    )
  }

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
  const RatingComplete = x => {
    console.warn(x);
    setKirim({
      ...kirim,
      nilai: x
    })



  }
  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 10,
      backgroundColor: colors.white
    }}>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <Text style={{
          flex: 1,
          fontFamily: fonts.secondary[600],
          color: colors.primary,
          fontSize: windowWidth / 30
        }}>
          Beri Bintang
        </Text>
        <Rating
          ratingBackgroundColor="#0000"
          size={10}
          onFinishRating={RatingComplete}
          style={{ padding: 10, }}
        />
      </View>
      <MyInput value={kirim.info} onChangeText={x => setKirim({
        ...kirim,
        info: x
      })} multiline label="Beri ulasan" iconname="create-outline" />
      <MyGap jarak={10} />
      <MyButton onPress={sendServer} title="Kirim" warna={colors.primary} />
      {loading && <View style={{
        marginVertical: 20,
      }}>
        <ActivityIndicator size="large" color={colors.primary} /></View>}
      {!loading && <FlatList data={data} renderItem={__renderItem} />}


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})