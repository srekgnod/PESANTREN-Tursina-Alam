package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	App      AppConfig
	DB       DBConfig
	Redis    RedisConfig
	JWT      JWTConfig
	Upload   UploadConfig
	CORS     CORSConfig
	WhatsApp WAConfig
	Log      LogConfig
}

type AppConfig struct {
	Name string
	Env  string
	Port string
	URL  string
}

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
	Timezone string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type JWTConfig struct {
	Secret        string
	RefreshSecret string
	Expiry        time.Duration
	RefreshExpiry time.Duration
}

type UploadConfig struct {
	Dir     string
	MaxSize int64 // MB
}

type CORSConfig struct {
	Origins string
}

type WAConfig struct {
	APIURL   string
	APIToken string
}

type LogConfig struct {
	Level string
	File  string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("WARN: .env file not found, using system environment variables")
	}

	jwtExpiry, _ := time.ParseDuration(getEnv("JWT_EXPIRY", "15m"))
	jwtRefreshExpiry, _ := time.ParseDuration(getEnv("JWT_REFRESH_EXPIRY", "168h"))
	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0"))
	maxUpload, _ := strconv.ParseInt(getEnv("MAX_UPLOAD_SIZE", "10"), 10, 64)

	return &Config{
		App: AppConfig{
			Name: getEnv("APP_NAME", "pesantren-api"),
			Env:  getEnv("APP_ENV", "development"),
			Port: getEnv("APP_PORT", "8080"),
			URL:  getEnv("APP_URL", "http://localhost:8080"),
		},
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Name:     getEnv("DB_NAME", "pesantren_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
			Timezone: getEnv("DB_TIMEZONE", "Asia/Jakarta"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       redisDB,
		},
		JWT: JWTConfig{
			Secret:        getEnv("JWT_SECRET", "change-me"),
			RefreshSecret: getEnv("JWT_REFRESH_SECRET", "change-me-refresh"),
			Expiry:        jwtExpiry,
			RefreshExpiry: jwtRefreshExpiry,
		},
		Upload: UploadConfig{
			Dir:     getEnv("UPLOAD_DIR", "./uploads"),
			MaxSize: maxUpload,
		},
		CORS: CORSConfig{
			Origins: getEnv("CORS_ORIGINS", "http://localhost:3000"),
		},
		WhatsApp: WAConfig{
			APIURL:   getEnv("WA_API_URL", ""),
			APIToken: getEnv("WA_API_TOKEN", ""),
		},
		Log: LogConfig{
			Level: getEnv("LOG_LEVEL", "debug"),
			File:  getEnv("LOG_FILE", "./logs/app.log"),
		},
	}
}

func (c *Config) IsProduction() bool {
	return c.App.Env == "production"
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
