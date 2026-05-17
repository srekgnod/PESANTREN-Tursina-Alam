package utils

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

var allowedImageTypes = map[string]bool{
	".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".gif": true,
}

var allowedDocTypes = map[string]bool{
	".pdf": true, ".doc": true, ".docx": true, ".xls": true, ".xlsx": true,
}

func SaveUploadedFile(file *multipart.FileHeader, uploadDir, subDir string) (string, error) {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedImageTypes[ext] && !allowedDocTypes[ext] {
		return "", fmt.Errorf("file type %s is not allowed", ext)
	}

	dir := filepath.Join(uploadDir, subDir)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	filename := fmt.Sprintf("%s_%d%s", uuid.New().String()[:8], time.Now().Unix(), ext)
	fullPath := filepath.Join(dir, filename)

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	dst, err := os.Create(fullPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	buf := make([]byte, 1024*32)
	for {
		n, readErr := src.Read(buf)
		if n > 0 {
			if _, writeErr := dst.Write(buf[:n]); writeErr != nil {
				return "", writeErr
			}
		}
		if readErr != nil {
			break
		}
	}

	return filepath.Join(subDir, filename), nil
}
