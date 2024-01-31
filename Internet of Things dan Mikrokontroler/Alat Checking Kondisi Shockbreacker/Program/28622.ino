//I2C
#include <LiquidCrystal_I2C.h>
#include <HX711.h>
#define DOUT 10
#define CLK  11
LiquidCrystal_I2C lcd(0x27, 16, 2);

//Loadcell
HX711 scale;
float calibration_factor = 1000; //Hasil Kalibrasi
float units;
float Newton;

//ultrasonic
int trigpin = 12; 
int echopin = 13; 
long jarak; // jarak adalah deklarasi selisih jarak
int x1; // x1 adalah deklarasi jarak akhir 
int x2; // x2 adalah deklarasi jarak awal 
float x3; // x3 adalah deklarasi waktu dalam microseconds
float x4; // x4 adalah deklarasi kecepatan 
unsigned long waktuSebelumnya = 0;
const long intervale = 1000;

void setup()
{
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();

  //Setup Berat
  scale.begin(DOUT, CLK);
  scale.set_scale();
  scale.tare();  //Reset the scale to 0
  long zero_factor = scale.read_average(); //Get a baseline reading
  Serial.print("Zero factor: "); //This can be used to remove the need to tare the scale. Useful in permanent scale projects.
  Serial.println(zero_factor);

  //Setup Ultrasonik  
  pinMode(12, OUTPUT);   
  pinMode(13, INPUT);
}
  
void loop()
{ 
   if (x1<280){
    //Jarak ultrasonik 
    digitalWrite(trigpin,LOW);     
    digitalWrite(trigpin,HIGH);     
    digitalWrite(trigpin,LOW);   
    float duration = pulseIn(echopin,HIGH);   
   
    x1 = (duration /58)*10; 
    Serial.print("Jarak Awal : ");   
    Serial.print(x1);
    Serial.println("mm");
    
    Serial.print("Jarak Akhir : ");
    Serial.print(x2);
    Serial.println("mm");

    jarak = (x1 - x2);
    Serial.print("Selisih: ");
    Serial.print(jarak);
    Serial.println("mm");
    x2 = (duration /58)*10;
    lcd.clear();
    lcd.setCursor(0,1);
    lcd.print("D:");
    lcd.setCursor(2,1);
    lcd.print(jarak);
    lcd.setCursor(5,1);
    lcd.print("mm");

    //berat loadcell
    scale.set_scale(calibration_factor); //Adjust to this calibration factor
    units = scale.get_units(), 1;
    if (units < 0)
    {
      units = 0.00;
    }
    Newton =  ((units/1000)*9.8);
    Serial.print("Berat:");
    Serial.print(units);
    Serial.println("Gram");
   
    Serial.print("Newton: "); // text to display
    Serial.print(Newton);
    Serial.println("N");  

    lcd.setCursor(0,0);
    lcd.print("W:"); // text to display
    lcd.print(Newton);
    lcd.print("N"); 
   
    //Waktu Microseconds
    millis();
    x3 = millis()/1000; //1 milliseconds = 1000 microseconds
    Serial.print("Waktu : ");
    Serial.print(x3);
    Serial.println(" µs");
  
    //Kecepatan
    x4 = x3/jarak;
    Serial.print("Kecepatan : ");
    Serial.print(x4);
    Serial.println(" mm/µs");
    lcd.setCursor(10,1);
    lcd.print("S:");
    lcd.setCursor(12,1);
    lcd.print(x4);
    }else
    if(x1>=280<=350){
    }
 }
