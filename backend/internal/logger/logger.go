package logger

import (
	"os"
	"path/filepath"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Log *zap.SugaredLogger

func Init(level, file string) {
	// Parse log level
	var zapLevel zapcore.Level
	switch level {
	case "debug":
		zapLevel = zapcore.DebugLevel
	case "info":
		zapLevel = zapcore.InfoLevel
	case "warn":
		zapLevel = zapcore.WarnLevel
	case "error":
		zapLevel = zapcore.ErrorLevel
	default:
		zapLevel = zapcore.InfoLevel
	}

	encoderCfg := zapcore.EncoderConfig{
		TimeKey:        "ts",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.CapitalColorLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}

	// Console core
	consoleSyncer := zapcore.AddSync(os.Stdout)
	consoleCore := zapcore.NewCore(
		zapcore.NewConsoleEncoder(encoderCfg),
		consoleSyncer,
		zapLevel,
	)

	cores := []zapcore.Core{consoleCore}

	// File core (JSON format)
	if file != "" {
		if err := os.MkdirAll(filepath.Dir(file), 0755); err == nil {
			if f, err := os.OpenFile(file, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644); err == nil {
				fileSyncer := zapcore.AddSync(f)
				encoderCfg.EncodeLevel = zapcore.CapitalLevelEncoder
				fileCore := zapcore.NewCore(
					zapcore.NewJSONEncoder(encoderCfg),
					fileSyncer,
					zapLevel,
				)
				cores = append(cores, fileCore)
			}
		}
	}

	core := zapcore.NewTee(cores...)
	zapLogger := zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))
	Log = zapLogger.Sugar()
}
