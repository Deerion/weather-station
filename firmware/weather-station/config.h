#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

#define I2C_SDA_PIN   21
#define I2C_SCL_PIN   22
#define MQ135_PIN     34

#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C

const float VOLTAGE_DIVIDER_CORRECTION = 1.667; 
const float SENSOR_VCC = 5.0;                   
const float RL_VALUE = 10.0;                    
const float RO_CLEAN_AIR = 10.0;                
const float ADC_RESOLUTION = 4095.0;
const float ADC_MAX_VOLTAGE = 3.3;  

const unsigned long SEND_INTERVAL = 3000; 

#endif