#include <Wire.h>
#include <MPU6050.h>
#include <SoftwareSerial.h>

#define DEBUG true
#define LM35 A0

MPU6050 mpu;
SoftwareSerial esp(10, 11);


unsigned long timer = 0;
float timeStep = 0.01;


int pitch = 0.0;
int roll = 0.0;
int yaw = 0.0;


String espMacAddress;

void espSetup(){
  String networkName = "";
  String networkPassword = "";

  sendData("AT+RST\r\n", 10000, DEBUG);
  sendData("AT+CWMODE=3\r\n", 10000, DEBUG);
  sendData("AT+CWJAP=\"138SL- Residents\",\"resident2020@138sl\"\r\n", 5000, DEBUG);

}

String getMacAddress(){
  String response = "";
  response = sendData("AT+CIPSTAMAC?\r\n\r\n", 3000, false);  
  return response.substring(42, 59);
}

String sendData(String command, const int timeout, boolean debug) {
    String response = "";
    
    esp.print(command); 
    
    unsigned long time = millis();
    
    while( (time+timeout) > millis())
    {
      while(esp.available())
      {
        char c = esp.read(); 
        response += c;
      }  
    }
    
    if(debug)
    {
      Serial.print(response);
    }
    
    return response;
}

void gyroscopeSetup(){
  Serial.println("Initialize MPU6050");
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G))
  {
    Serial.println("Error");
    delay(500);
  }
  
  
  mpu.calibrateGyro();
  mpu.setThreshold(1);
}

int readGyroscope(){  
  Vector rawGyro = mpu.readRawGyro();
  Vector normGyro = mpu.readNormalizeGyro();


  return (int)rawGyro.YAxis;
}

int getTemperature(int testing){
  float voltage, temp;

  if (testing == 0){
    
    voltage = analogRead(LM35) * (5.0/1023.0);
    temp = 100 * voltage;
  }
  else{
    
    temp = random(28, 50);
  }  

  return (int)temp;
}

String generatePostRequest(String route, String portNumber, int cLength, String pData) {
  String requestType = "POST /" + route + " HTTP/1.1\r\n";
  String hostInfo = "Host: 192.168.1.11:" + portNumber + "\r\n";
  String contentType = "Content-Type: application/json\r\n";
  String contentLength = "Content-Length: " + String(cLength) + "\r\n\r\n";
  String postData = pData + "\r\n\r\n";

  return requestType + hostInfo + contentType + contentLength + postData;
}

String generateCIPSend(int requestLength){
  String cipSend = "AT+CIPSEND=" + String(requestLength) + "\r\n";
  
  return cipSend;
}

String generatePost(String patient_id, float pos, int temp){
  String post = "{\"patient_id\": \""+patient_id+ "\", \"position\": "+String(pos)+ ", \"temperature\": "+String(temp)+"}\r\n\r\n";
  
  return post;
}

void setup() {
  Serial.begin(9600);
  esp.begin(9600);


  gyroscopeSetup();
  espSetup();
  pinMode(LM35, INPUT);

  
  espMacAddress = getMacAddress();
  Serial.print("MAC Address: "); Serial.println(espMacAddress);
}

void loop() {  
  int temp;
  int pos;

  pos = readGyroscope();
  temp = getTemperature(0);

  String postData = generatePost(espMacAddress, pos, temp);
  String postRequest = generatePostRequest("api/record", "5000", postData.length(), postData);  
  String CIPSend = generateCIPSend(postRequest.length());

  sendData("AT+CIPSTART=\"TCP\",\"192.168.1.6\",5000\r\n", 3000, DEBUG);
  sendData(CIPSend, 1000, DEBUG);
  sendData(postRequest, 5000, DEBUG);