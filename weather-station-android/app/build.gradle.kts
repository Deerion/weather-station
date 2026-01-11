import java.util.Properties // <--- 1. Import niezbędny do czytania pliku

plugins {
    alias(libs.plugins.android.application)
}

// <--- 2. Logika wczytywania pliku local.properties
val localProperties = Properties()
val localPropertiesFile = rootProject.file("local.properties")
if (localPropertiesFile.exists()) {
    localProperties.load(localPropertiesFile.inputStream())
}
// --->

android {
    namespace = "com.example.weather_station_android"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.weather_station_android"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // <--- 3. Wstrzykiwanie kluczy do aplikacji
        // Jeśli nie znajdzie klucza w pliku, wstawi pusty tekst "" żeby się nie wywaliło
        buildConfigField("String", "SUPABASE_URL", localProperties.getProperty("SUPABASE_URL") ?: "\"\"")
        buildConfigField("String", "SUPABASE_KEY", localProperties.getProperty("SUPABASE_KEY") ?: "\"\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    buildFeatures {
        viewBinding = true
        buildConfig = true // <--- 4. To musi być włączone, żeby klasa BuildConfig powstała
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.constraintlayout)
    implementation(libs.navigation.fragment)
    implementation(libs.navigation.ui)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)

    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    // Biblioteka do "pociągnij żeby odświeżyć"
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
}