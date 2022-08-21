import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { urlAPI, urlLaporan } from '../../utils/localStorage';
import { MyButton, MyGap } from '../../components';
import { useIsFocused } from '@react-navigation/native';
export default function ListDetail({ navigation, route }) {
  const [item, setItem] = useState(route.params);
  navigation.setOptions({ title: 'Informasi Laporan' });
  const [data, setData] = useState({});
  const [buka, setBuka] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {

    if (isFocused) {
      DataDetail();
    }
  }, [isFocused]);
  let nama_icon = '';

  if (data.status == "DONE") {
    nama_icon = 'checkmark-circle-outline';
  } else {
    nama_icon = 'close-circle-outline';
  }


  const DataDetail = () => {
    setTimeout(() => {
      axios
        .post(urlAPI + '/1data_laporan_detail.php', {
          id: item.id,
        })
        .then(res => {
          console.warn('detail transaksi', res.data);
          setData(res.data);
          setBuka(true);
        });
    }, 800)
  }

  const MyList = ({ label, value }) => {
    return (
      <View style={{
        flexDirection: 'row',
        padding: 10,
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{label}</Text>
        </View>
        <View style={{
          flex: 1.5,
          justifyContent: 'flex-start',
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>
            {value}
          </Text>
        </View>
      </View>

    )
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.border
      }}>

      {!buka && <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>}
      {buka &&
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 5, flex: 1 }}>

          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>

            <MyList label="Jenis Laporan" value={data.tipe} />
            {data.tipe == 'LANJUTAN' && <MyList label='Konseling Lanjutan ke' value={data.lanjutan} />}
            <MyList label="Tanggal" value={data.tanggal_indo} />
            <MyList label="Konselor" value={data.nama_lengkap} />
            <MyList label="Spesialisasi" value={data.spesialisasi} />
            <MyList label='Nama Konseli :' value={data.nama_konseli} />
            <MyList label='Pangkat / NRP / NIP :' value={data.pangkat} />
            <MyList label='Kesatuan :' value={data.kesatuan} />
            <MyList label='Status :' value={data.status} />
            <MyList label='Alamat :' value={data.alamat} />
            <MyList label='Keluhan Konseli :' value={data.keluhan} />
            <MyList label='Permasalahan :' value={data.masalah} />
            <MyList label='Rumusan Permasalahan :' value={data.rumusan_masalah} />
            <MyList label='Hasil Observasi :' value={data.hasil_observasi} />
            <MyList label='Hasil Wawancara :' value={data.hasil_wawancara} />
            <MyList label='Alternatif Pemecahan Masalah :' value={data.alternatif} />
            <MyList label='Kesimpulan dan Saran :' value={data.kesimpulan} />
            <MyList label='Penutup :' value={data.penutup} />


            <View style={{
              padding: 10,
            }}>
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 30,
                color: colors.black,

              }}>
                Foto Pemeriksaan
              </Text>
              <Image source={{
                uri: urlLaporan + data.foto_laporan
              }} style={{
                height: 300,
                resizeMode: 'contain'
              }} />
            </View>







          </View>


        </ScrollView>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    height: 80,
    margin: 5,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    textAlign: 'center',
  },
  date: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    textAlign: 'center',
  },
});
