#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <time.h>
#include <vector>
#include <ArduinoJson.h>

#define SS_PIN 4       // D2
#define RST_PIN 5      // D1
#define LED_FAIL 0     // D3
#define LED_SUCCESS 15 // D8

WiFiClient client; // Cliente wifi

DynamicJsonDocument doc(1024);

time_t lastConfigFetch = 0;

// Cria um objeto  MFRC522.
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup()
{
    Serial.begin(9600);

    pinMode(LED_FAIL, OUTPUT);
    pinMode(LED_SUCCESS, OUTPUT);
    digitalWrite(LED_FAIL, LOW);
    digitalWrite(LED_SUCCESS, LOW);

    WiFi.begin("", "");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Conectando ao Wifi...");
    }

    SPI.begin();
    mfrc522.PCD_Init(); // Inicia Leitor de cartão
}

void getConfig()
{
    Serial.println("\nBuscando dados de acesso");
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(client, "http://...:8080/config");
        int httpCode = http.GET();

        if (httpCode == 200)
        {
            String payload = http.getString();

            deserializeJson(doc, payload);

            Serial.println("Dados de accesso adquiridos!");
        }
        else
        {
            Serial.print("Erro buscando configuração");
            Serial.println(http.errorToString(httpCode));
        }

        http.end();
    }
    else
    {
        Serial.println("Erro com conexão Wifi");
    }
}

void postLog(String data)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(client, "http://...:8080/log");
        int httpCode = http.POST(data);
        http.end();
    }
    else
    {
        Serial.println("Erro com conexão Wifi");
    }
}

void loop()
{
    digitalWrite(LED_FAIL, LOW);
    digitalWrite(LED_SUCCESS, LOW);

    time_t ts = time(NULL);
    if (lastConfigFetch == 0 || ts - lastConfigFetch > 30)
    {
        lastConfigFetch = ts;
        getConfig();
    }

    // Esperar novos cartões.
    if (!mfrc522.PICC_IsNewCardPresent())
    {
        delay(100);
        return;
    }

    // Faça a leitura do ID do cartão
    if (mfrc522.PICC_ReadCardSerial())
    {
        String rfid_data = "";
        for (uint8_t i = 0; i < mfrc522.uid.size; i++)
        {
            rfid_data.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
            rfid_data.concat(String(mfrc522.uid.uidByte[i], HEX));
        }
        rfid_data.toUpperCase();

        JsonObject obj = doc.as<JsonObject>();

        bool allowed = false;
        for (long i = 0; i < obj["keys"].size(); i++)
        {
            if (obj["keys"][i] == rfid_data)
            {
                allowed = true;
            }
        }

        String name = obj["info"][rfid_data]["name"];
        Serial.println("\nUsuário: " + name);
        String cpf = obj["info"][rfid_data]["CPF"];
        Serial.println("CPF: " + cpf);

        if (allowed)
        {
            Serial.print("Accesso permitido, chave: ");
        }
        else
        {
            Serial.print("Accesso negado, chave: ");
        }
        Serial.println(rfid_data);

        String allowed_key = allowed ? "1" : "0";
        // {"key": rfid_data, "success": allowed}
        postLog("{\"key\":\"" + rfid_data + "\",\"success\":" + allowed_key + "}");

        if (allowed)
        {
            digitalWrite(LED_SUCCESS, HIGH);
        }
        else
        {
            digitalWrite(LED_FAIL, HIGH);
        }

        delay(1000);
    }
}