package database

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
	"github.com/tursinaalam/pesantren-api/internal/config"
)

func NewRedis(cfg *config.RedisConfig) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	if err := client.Ping(context.Background()).Err(); err != nil {
		log.Printf("WARN: Redis connection failed: %v (continuing without cache)", err)
		return client
	}

	log.Println("Redis connected successfully")
	return client
}
