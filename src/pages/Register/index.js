import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import LottieView from 'lottie-react-native';
import { urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';

export default function Register({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [open, setOpen] = useState(false);
  const [kota, setKota] = useState([]);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const validate = text => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // console.log('Email is Not Correct');
      setData({ ...data, email: text });
      setValid(false);
      return false;
    } else {
      setData({ ...data, email: text });
      setValid(true);
      // console.log('Email is Correct');
    }
  };

  const [level, setlevel] = useState({
    1: true,
    2: false
  })

  const [data, setData] = useState({
    nama_lengkap: '',
    nrp: '',
    spesialisasi: '',
    level: 'Konseli',
    email: '',
    password: '',
    telepon: '62',
    kota: 'Kabupaten Agam - Sumatera Barat',
    fid_kota: '12'
  });

  const simpan = () => {
    if (
      data.nama_lengkap.length === 0 &&
      data.email.length === 0 &&
      data.password.length === 0 &&
      data.telepon.length === 0 &&
      data.nrp.length === 0 &&
      data.kota.length === 0
    ) {
      showMessage({
        message: 'Maaf Semua Field Harus Di isi !',
      });
    } else if (data.nama_lengkap.length === 0) {
      showMessage({
        message: 'Maaf Nama Lengkap masih kosong !',
      });
    } else if (data.kota.length === 0) {
      showMessage({
        message: 'Maaf Wilayah masih kosong !',
      });
    } else if (data.nrp.length === 0) {
      showMessage({
        message: 'Maaf Pangkat/NRP/Umum masih kosong !',
      });
    } else if (data.email.length === 0) {
      showMessage({
        message: 'Maaf email masih kosong !',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Maaf Telepon masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      axios
        .post(urlAPI + '/register.php', data)
        .then(res => {
          console.warn(res.data);
          let err = res.data.split('#');

          // console.log(err[0]);
          if (err[0] == 50) {
            setTimeout(() => {
              setLoading(false);
              showMessage({
                message: err[1],
                type: 'danger',
              });
            }, 1200);
          } else {
            setTimeout(() => {
              navigation.replace('Success', {
                messege: res.data,
              });
            }, 1200);
          }
        });
    }
  };

  useEffect(() => {

    axios.post(urlAPI + '/1kota.php').then(res => {
      console.warn('get user', res.data);
      setKota(res.data);
    })
  }, [])




  return (
    <ImageBackground
      source={require('../../assets/back.jpeg')}
      style={{
        flex: 1,

      }}>
      {/* <Switch onValueChange={toggleSwitch} value={isEnabled} /> */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>
        {/* <Image
        source={require('../../assets/logooren.png')}
        style={styles.image}
      /> */}


        {/* Level */}
        <View style={{
          paddingVertical: 5,
        }}>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.primary,
          }}>Pilihan Tipe Pengguna : </Text>
          <View style={{
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
            <TouchableOpacity onPress={() => {
              setlevel({
                1: true,
                2: false,
              });
              setData({
                ...data,
                level: 'Konseli'
              });


            }
            } style={{
              flex: 1,
              borderWidth: 1,
              borderColor: level[1] ? colors.primary : colors.border,
              flexDirection: 'row',
              margin: 5,
              padding: 0,

            }}>
              <View style={{
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: level[1] ? colors.primary : colors.border,
              }}>
                {level[1] && <Icon type='ionicon' name='checkbox' color={colors.white} size={windowWidth / 30} />}

              </View>

              <Text style={{
                margin: 10,
                textAlign: 'center',
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 35,
              }}>Konseli</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {
              setlevel({
                1: false,
                2: true,
              });
              setData({
                ...data,
                level: 'Konselor',
              })


            }

            } style={{
              flex: 1,
              borderWidth: 1,
              borderColor: level[2] ? colors.primary : colors.border,
              flexDirection: 'row',
              margin: 5,
              padding: 0,

            }}>
              <View style={{
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: level[2] ? colors.primary : colors.border,
              }}>
                {level[2] && <Icon type='ionicon' name='checkbox' color={colors.white} size={windowWidth / 30} />}

              </View>

              <Text style={{
                margin: 10,
                textAlign: 'center',
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 35,
              }}>Konselor</Text>
            </TouchableOpacity>
          </View>
        </View>


        <MyGap jarak={10} />
        <MyInput
          label="Nama Pribadi *"
          iconname="person"
          value={data.nama_lengkap}
          onChangeText={value =>
            setData({
              ...data,
              nama_lengkap: value,
            })
          }
        />


        <MyGap jarak={10} />
        <MyInput
          label="Pangkat/NRP/Umum *"
          iconname="ribbon"
          value={data.nrp}
          onChangeText={value =>
            setData({
              ...data,
              nrp: value,
            })
          }
        />

        {level[2] && <>
          <MyGap jarak={10} />
          <MyInput
            label="Spesialisasi"
            iconname="star"
            value={data.spesialisasi}
            onChangeText={value =>
              setData({
                ...data,
                spesialisasi: value,
              })
            }
          />
        </>}







        <MyGap jarak={10} />
        <MyInput
          label="E - mail *"
          iconname="mail"
          value={data.email}
          onChangeText={value =>
            setData({
              ...data,
              email: value,
            })
          }
        />

        <MyGap jarak={10} />
        <MyInput
          label="Telepon *"
          iconname="call"
          keyboardType="phone-pad"
          value={data.telepon}
          onChangeText={value =>
            setData({
              ...data,
              telepon: value,
            })
          }
        />
        <MyGap jarak={10} />

        <MyPicker onValueChange={x => {

          let kt = x.split("#");

          setData({
            ...data,
            kota: kt[1],
            fid_kota: kt[0]
          })
        }} label='Wilayah*' iconname='loaction' data={kota} />

        <MyGap jarak={10} />
        <MyInput
          label="Alamat lengkap *"
          iconname="map"
          value={data.alamat}
          onChangeText={value =>
            setData({
              ...data,
              alamat: value,
            })
          }
        />




        <MyGap jarak={10} />
        <MyInput
          label="Password"
          iconname="key"
          secureTextEntry={show}
          value={data.password}
          onChangeText={value =>
            setData({
              ...data,
              password: value,
            })
          }
        />

        {!show && <TouchableOpacity onPress={() => {
          setShow(true)
        }} style={{
          paddingHorizontal: 5,
          paddingVertical: 10,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          flexDirection: 'row'
        }}>
          <Icon size={windowWidth / 25} type='ionicon' name='eye-off-outline' />
          <Text style={{
            left: 5,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30
          }}>Hide Password</Text>
        </TouchableOpacity>}

        {show && <TouchableOpacity onPress={() => {
          setShow(false)
        }} style={{
          paddingHorizontal: 5,
          paddingVertical: 10,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          flexDirection: 'row'
        }}>
          <Icon size={windowWidth / 25} type='ionicon' name='eye-outline' />
          <Text style={{
            left: 5,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30
          }}>Show Password</Text>
        </TouchableOpacity>}
        <MyGap jarak={20} />

        <MyButton
          warna={colors.primary}
          title="REGISTER"
          Icons="log-in"
          onPress={simpan}
        />

        <MyGap jarak={20} />
      </ScrollView>
      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: 620 / 4,
    height: 160 / 4,
  },
});
