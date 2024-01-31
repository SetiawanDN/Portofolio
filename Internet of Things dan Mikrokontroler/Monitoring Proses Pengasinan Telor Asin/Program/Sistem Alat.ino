#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <BH1750.h>

#define DHTPIN 12 // Pin data DHT11 terhubung ke pin D2 (GPIO4)
#define DHTTYPE DHT11 // Jenis sensor DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);

const int tdsPin = A0; // Pin sensor TDS terhubung ke pin A0
BH1750 lightMeter;

LiquidCrystal_I2C lcd(0x27, 16, 2); // Alamat I2C LCD, 16 karakter x 2 baris

float kalibrasiSuhu = 0.5; // Nilai kalibrasi suhu, tambahkan 0,5°C ke nilai suhu terbaca

const char* ssid = "wawan";
const char* password = "wawan011101";
#define FIREBASE_HOST "https://telur-appsin-default-rtdb.firebaseio.com/state"
#define FIREBASE_AUTH "imqitAXh16sdV0jMLuh5NPBsHpBsChuj4cKBKsUm" // Atur token autentikasi Firebase jika diperlukan
FirebaseData firebaseData;

// Nilai awal kadar garam menjadi 0
int kadarGaram_ppm = 0;

void setup() {
  Serial.begin(9600);
  lcd.begin(16, 2);  // Inisialisasi LCD
  lcd.init(); // Inisialisasi LCD
  lcd.backlight(); // Menghidupkan backlight LCD
  lcd.clear(); // Membersihkan LCD

  lcd.setCursor(0, 0);
  lcd.print("Membaca Sensor...");
  delay(2000); // Tampilkan teks "Membaca Sensor..." selama 2 detik

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("S:");
  lcd.setCursor(9, 0);
  lcd.print("G:");
  lcd.setCursor(0, 1);
  lcd.print("C:");

  dht.begin();
  delay(1000); // Delay 1 detik untuk stabilisasi sensor

  // Koneksi WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Menghubungkan ke WiFi...");
  }
  Serial.println("Terhubung ke WiFi");
  
  // Inisialisasi Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  // Inisialisasi Wire
  Wire.begin();
  // Inisialisasi sensor BH1750
  lightMeter.begin();
}

void loop() {
  // Baca suhu dari sensor DHT11
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println("Gagal membaca suhu dari sensor DHT!");
  } else {
    // Kalibrasi suhu dengan menambahkan nilai kalibrasi
    float suhu = event.temperature - kalibrasiSuhu;

    Serial.print("Suhu: ");
    Serial.print(suhu);
    Serial.println(" *C");
    lcd.setCursor(2, 0);
    lcd.print(suhu, 1);
    lcd.print((char)223);
    lcd.print("C");

    // Kirim suhu ke Firebase
    Firebase.setFloat(firebaseData, "/state/1/suhu", suhu);

    // Cek kualitas suhu
    if (suhu >= 25 && suhu <= 30) {
      Serial.println("Kualitas Suhu: Baik");
      Firebase.setString(firebaseData, "/state/1/kualitasSuhu", "Baik");
    } else {
      Serial.println("Kualitas Suhu: Tidak Baik");
      Firebase.setString(firebaseData, "/state/1/kualitasSuhu", "Buruk");
    }
  }

  // Baca kadar garam dari sensor TDS
  int sensorValue = analogRead(tdsPin);

  // Ubah nilai ADC menjadi ppm (mg/L) menggunakan kalibrasi yang sesuai
  kadarGaram_ppm = map(sensorValue, 0, 1023, 0, 5000);

  // Konversi kadar garam dalam ppm (mg/L) menjadi gram
  float kadarGaram_gram = (kadarGaram_ppm / 1000.0) - 0.777;

  Serial.print("Kadar Garam: ");
  Serial.print(kadarGaram_gram);
  Serial.println(" gram");

  lcd.setCursor(11,0);
  lcd.print(kadarGaram_gram, 3);
  lcd.print("g");

  Firebase.setFloat(firebaseData, "/state/1/kadarGaram", kadarGaram_gram);

  if (kadarGaram_gram >= 1120) {
    Serial.println("Kualitas Kadar Garam: Baik");
    Firebase.setString(firebaseData, "/state/1/kualitasKadarGaram", "Baik");
  } else {
    Serial.println("Kualitas Kadar Garam: Tidak Baik");
    Firebase.setString(firebaseData, "/state/1/kualitasKadarGaram", "Tidak Baik");
  }

  // Baca intensitas cahaya dari sensor BH1750
  float intensitasCahaya = lightMeter.readLightLevel();

  Serial.print("Intensitas Cahaya: ");
  Serial.print(intensitasCahaya);
  Serial.println(" lux");
  lcd.setCursor(2, 1);
  lcd.print(intensitasCahaya);
  lcd.print("lux");

  Firebase.setFloat(firebaseData, "/state/1/intensitasCahaya", intensitasCahaya);

  if (intensitasCahaya >= 630 && intensitasCahaya <= 800) {
    Serial.println("Kualitas Intensitas Cahaya: Baik");
    Firebase.setString(firebaseData, "/state/1/kualitasIntensitasCahaya", "Baik");
  } else {
    Serial.println("Kualitas Intensitas Cahaya: Tidak Baik");
    Firebase.setString(firebaseData, "/state/1/kualitasIntensitasCahaya", "Tidak Baik");
  }

  delay(1000); // Ubah delay menjadi 1 detik untuk pembacaan lebih cepat
}
