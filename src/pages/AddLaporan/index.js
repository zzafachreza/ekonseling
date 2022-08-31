import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, PermissionsAndroid } from 'react-native';
import { MyPicker, MyGap, MyInput, MyButton } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../utils/colors';
import { fonts, windowWidth } from '../../utils/fonts';
import { Image } from 'react-native';
import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
export default function AddLaporan({ navigation, route }) {
    const [data, setData] = useState({
        tipe: route.params.tipe,
        tanggal: new Date(),
        nama_konseli: '',
        pangkat: '',
        kesatuan: '',
        status: 'Menikah',
        alamat: '',
        keluhan: '',
        masalah: 'Narkoba',
        rumusan_masalah: '',
        hasil_observasi: '',
        hasil_wawancara: '',
        alternatif: '',
        kesimpulan: '',
        penutup: '',
        lanjutan: '',
    });
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [foto, setfoto] = useState('https://zavalabs.com/nogambar.jpg');

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [TanggalTarget, setTanggalTarget] = useState('');
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        // alert(currentDate);

        const Today = new Date(currentDate);
        const dd = String(Today.getDate()).padStart(2, '0');
        const mm = String(Today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = Today.getFullYear();
        const jam = Today.getHours();
        const menit = Today.getMinutes();
        const detik = Today.getUTCSeconds();
        const today = `${dd}/${mm}/${yyyy}`;
        setData({
            ...data,
            tanggal: today,
        });
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Izinkan Aplikasi untuk akses Kamera",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const hideMode = currentMode => {
        setShow(false);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const hideDatepicker = () => {
        hideMode('date');
    };

    const options = {
        includeBase64: true,
        quality: 0.5,
        maxWidth: 1000,
        maxHeight: 1000,
    };

    const getCamera = xyz => {
        launchCamera(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image Picker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                switch (xyz) {
                    case 1:
                        setData({
                            ...data,
                            foto: `data:${response.type};base64, ${response.base64}`,
                        });
                        setfoto(`data:${response.type};base64, ${response.base64}`);
                        break;
                }
            }
        });
    };

    const getGallery = xyz => {
        launchImageLibrary(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image Picker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                switch (xyz) {
                    case 1:
                        setData({
                            ...data,
                            foto: `data:${response.type};base64, ${response.base64}`,
                        });
                        setfoto(`data:${response.type};base64, ${response.base64}`);
                        break;
                }
            }
        });
    };

    const UploadFoto = ({ onPress1, onPress2, label, foto }) => {
        return (
            <View
                style={{
                    padding: 10,
                    backgroundColor: colors.white,
                    marginVertical: 10,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: colors.border,
                    elevation: 2,
                }}>
                <Text
                    style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.black,
                    }}>
                    {label}
                </Text>
                <Image
                    source={{
                        uri: foto,
                    }}
                    style={{
                        width: '100%',
                        aspectRatio: 2,
                        resizeMode: 'contain',
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <View
                        style={{
                            flex: 1,
                            paddingRight: 5,
                        }}>
                        <MyButton
                            onPress={onPress1}
                            colorText={colors.white}
                            title="KAMERA"
                            warna={colors.primary}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: 5,
                        }}>
                        <MyButton
                            onPress={onPress2}
                            title="GALLERY"
                            colorText={colors.white}
                            warna={colors.secondary}
                        />
                    </View>
                </View>
            </View>
        );
    };





    useEffect(() => {

        requestCameraPermission();
        const Today = new Date();
        const dd = String(Today.getDate()).padStart(2, '0');
        const mm = String(Today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = Today.getFullYear();
        const jam = Today.getHours();
        const menit = Today.getMinutes();
        const detik = Today.getUTCSeconds();
        const today = `${dd}/${mm}/${yyyy}`;
        getData('user').then(res => {
            setData({
                ...data,
                tanggal: today,
                fid_user: res.id,
            });
        });
    }, []);
    //   kirim ke server

    const kirim = () => {

        console.log(data);
        setLoading(true);
        setTimeout(() => {
            axios
                .post(urlAPI + '/1add_laporan.php', data)
                .then(x => {
                    setLoading(false);
                    alert('Pembuatan Laporan berhasil Di Kirim');
                    console.log('respose server', x.data);
                    navigation.navigate('MainApp');
                });
        }, 1200)
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                backgroundColor: colors.primary,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 20,
                    color: colors.white
                }}>LAPOARAN {data.tipe}</Text>
            </View>
            <ScrollView
                style={{
                    padding: 10,
                }}>

                <MyGap jarak={5} />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        format="YYYY-MM-DD"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <MyInput
                    value={data.tanggal}
                    onChangeText={x =>
                        setData({
                            ...data,
                            tipe: x,
                        })
                    }
                    label="Tanggal Pemeriksaan :"
                    iconname="calendar-outline"
                    onFocus={showDatepicker}
                />

                <MyGap jarak={5} />

                {data.tipe == 'LANJUTAN' && <>
                    <MyInput value={data.lanjutan} onChangeText={x => setData({ ...data, lanjutan: x, })} label='Konseling Lanjutan ke :' iconname='create-outline' /><MyGap jaral={10} /></>
                }

                <MyInput value={data.nama_konseli} onChangeText={x => setData({ ...data, nama_konseli: x, })} label='Nama Konseli :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput value={data.pangkat} onChangeText={x => setData({ ...data, pangkat: x, })} label='Pangkat / NRP / NIP :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput value={data.kesatuan} onChangeText={x => setData({ ...data, kesatuan: x, })} label='Kesatuan :' iconname='create-outline' /><MyGap jaral={10} />

                <MyPicker
                    onValueChange={x =>
                        setData({
                            ...data,
                            status: x,
                        })
                    }
                    iconname="list"
                    label="Status :"
                    data={[
                        { label: 'Menikah', value: 'Menikah', },
                        { label: 'Belum Menikah', value: 'Belum Menikah', },



                    ]}
                />



                <MyInput multiline value={data.alamat} onChangeText={x => setData({ ...data, alamat: x, })} label='Alamat :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput multiline value={data.keluhan} onChangeText={x => setData({ ...data, keluhan: x, })} label='Keluhan Konseli :' iconname='create-outline' /><MyGap jaral={10} />

                <MyPicker
                    onValueChange={x =>
                        setData({
                            ...data,
                            masalah: x,
                        })
                    }
                    iconname="list"
                    label="Permasalahan :"
                    data={[
                        { label: 'Narkoba', value: 'Narkoba', },
                        { label: 'Keluarga', value: 'Keluarga', },
                        { label: 'Tindak Pidana', value: 'Tindak Pidana', },
                        { label: 'Kode Etik', value: 'Kode Etik', },
                        { label: 'Pelanggaran Disiplin', value: 'Pelanggaran Disiplin', },
                        { label: 'Sakit', value: 'Sakit', },
                        { label: 'Hasil Emental', value: 'Hasil Emental', },
                        { label: 'Lainnya', value: 'Lainnya', },


                    ]}
                />

                <MyInput multiline value={data.rumusan_masalah} onChangeText={x => setData({ ...data, rumusan_masalah: x, })} label='Rumusan Permasalahan :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput multiline value={data.hasil_observasi} onChangeText={x => setData({ ...data, hasil_observasi: x, })} label='Hasil Observasi :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput multiline value={data.hasil_wawancara} onChangeText={x => setData({ ...data, hasil_wawancara: x, })} label='Hasil Wawancara :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput multiline value={data.alternatif} onChangeText={x => setData({ ...data, alternatif: x, })} label='Alternatif Pemecahan Masalah :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput multiline value={data.kesimpulan} onChangeText={x => setData({ ...data, kesimpulan: x, })} label='Kesimpulan dan Saran :' iconname='create-outline' /><MyGap jaral={10} />
                <MyInput multiline lineheight={20} value={data.penutup} onChangeText={x => setData({ ...data, penutup: x, })} label='Penutup :' iconname='create-outline' /><MyGap jaral={10} />


                <UploadFoto
                    onPress1={() => getCamera(1)}
                    onPress2={() => getGallery(1)}
                    label="Upload Pemeriksaan"
                    foto={foto}
                />
                <MyButton
                    onPress={kirim}
                    title="Simpan Laporan"
                    iconColor={colors.white}
                    Icons="checkmark-circle-outline"
                    warna={colors.primary}
                    colorText={colors.white}
                />
                <MyGap jarak={20} />
            </ScrollView>
            {
                loading && (
                    <LottieView
                        source={require('../../assets/animation.json')}
                        autoPlay
                        loop
                        style={{
                            flex: 1,
                            backgroundColor: colors.primary,
                        }}
                    />
                )
            }
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({});
