import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:kursus/utility/size_adapter.dart';
import 'package:kursus/widgets/Textfield.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:kursus/utility/size_adapter.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:kursus/screen/tabelscreen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:kursus/firebase_options.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

class Registerform extends StatefulWidget {
  const Registerform({ Key? key }) : super(key: key);

  @override
  State<Registerform> createState() => _RegisterformState();
}

class _RegisterformState extends State<Registerform> {
  final _formKey = GlobalKey<FormState>();
  final nama = TextEditingController();
  final alamat = TextEditingController();
  final noHP = TextEditingController();
  late String lokasii;
  late File image;
  String JenisKelamin = "";

  @override
  void initState() {
    super.initState();
  }

  Future<void> _getLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // cek apakah GPS sudah aktif
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // GPS belum aktif
      return Future.error('GPS user tidak aktif.');
    }

    // cek apakah aplikasi sudah mendapatkan izin untuk mengakses lokasi
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      // aplikasi belum mendapatkan izin untuk mengakses lokasi
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // pengguna menolak untuk memberikan izin
        return Future.error('User menolak memberikan izin akses GPS');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // pengguna menolak untuk memberikan izin secara permanen
      return Future.error(
          'User menolak permanen akses ke GPS');
    }
    // mendapatkan lokasi GPS menggunakan package geolocator
    final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
    lokasii = position.latitude.toString() + "," + position.longitude.toString();
    // lalu disimpan ke dalam variabel lokasii
  }

  void _pilihJK(String? value) {
    setState(() {
      JenisKelamin = value!;
    });
  }

  Future<void> _getImage() async {
    // mengambil gambar dari galeri menggunakan package image_picker
    final picker = ImagePicker();
    final pickedFile = await picker.getImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        image = File(pickedFile.path);
      } else {
        print('Tidak ada gambar yang dipilih.');
      }
    });
  }

  Future<void> _submitForm() async {
    // proses submit form
    // proses upload foto ke Firebase Storage
    try {
      if (image != null) {
        // upload foto ke Firebase Storage
        final ref = FirebaseStorage.instance
            .ref()
            .child('Serkom')
            .child(nama.text + '.jpg');
        await ref.putFile(image);
        final url = await ref.getDownloadURL();
        print("URL: $url");
      }
    } catch (e) {
      print("Error: $e");
    }
    try {
      await FirebaseFirestore.instance.collection('Serkom').add({
        'nama': nama.text,
        'alamat': alamat.text,
        'noHP': noHP.text,
        'JenisKelamin': JenisKelamin,
        'lokasii': lokasii,
      });
    } catch (e) {
      print("Error: $e");
    }
  nama.clear();
  alamat.clear();
  noHP.clear();
  JenisKelamin = "";
  lokasii = "";
  image = File("");

    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => tabelScreen()),
    );
  }
  @override
  Widget build(BuildContext context) {
    SizeAdapter.size(context: context);
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Padding(
        padding: const EdgeInsets.only(top: 48),
        child: Form(
          key: _formKey,
          child: SizedBox(
            width: SizeAdapter.screenWidth,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [SizedBox(child: Text("Form pendaftaran Peserta BNSP")),
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: textFieldfill(fieldLabel: "Nama", ht: "", textController: nama, size: 112),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: textFieldfill(fieldLabel: "Alamat",ht: "", textController: alamat, size: 112),
                ),
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: textFieldfill(fieldLabel: "Nomor HP",ht: "", textController: noHP, size: 112),
                ),Padding(
                  padding: EdgeInsets.only(top: 20),
                  child: Row(
                    children: <Widget>[
                      Text("Jenis Kelamin"),
                      Radio(
                        value: "Pria",
                        groupValue: JenisKelamin,
                        onChanged: _pilihJK,
                        fillColor: MaterialStateColor.resolveWith((states) => Colors.black),
                      ),
                      Text("Pria"),
                      Radio(
                        value: "Wanita",
                        groupValue: JenisKelamin,
                        onChanged: _pilihJK,
                        fillColor: MaterialStateColor.resolveWith((states) => Colors.black)
                      ),
                      Text("Wanita"),
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Row(
                    children: <Widget>[
                      Text("Lokasi Pendaftaran : "),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                        onPressed: () async {
                          await _getLocation();
                          showDialog(
                              context: context,
                              builder: (context) {
                                return AlertDialog(
                                  title: Text("Lokasi User"),
                                  content: Text(lokasii),
                                );
                              });
                        },
                        child: Text("Cek Lokasi User"),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Row(
                    children: <Widget>[
                      Text("Unggah Foto : "),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                        onPressed: () async {
                          await _getImage();
                          showDialog(
                              context: context,
                              builder: (context) {
                                return AlertDialog(
                                  title: Text("Foto Calon Peserta"),
                                  content: Image.file(image),
                                );
                              });
                        },
                        child: Text("Upload Foto"),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                    onPressed: () async{
                      if (_formKey.currentState!.validate()) {
                        await _submitForm();
                        ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Data terunggah")));
                      }
                    },
                    child: Text("Submit"),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}