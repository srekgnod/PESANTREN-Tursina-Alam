package dto

import (
	"time"

	"github.com/google/uuid"
)

// ===================== AUTH =====================

type LoginRequest struct {
	Username string `json:"username" binding:"required,min=3"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginResponse struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token"`
	ExpiresIn    int64        `json:"expires_in"`
	User         UserResponse `json:"user"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required,min=6"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

// ===================== USER =====================

type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required,min=3,max=100"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required,min=2"`
	Phone    string `json:"phone" binding:"omitempty,min=10,max=20"`
	Role     string `json:"role" binding:"required,oneof=super_admin admin pengurus ustadz wali_santri santri"`
}

type UpdateUserRequest struct {
	Email    string `json:"email" binding:"omitempty,email"`
	FullName string `json:"full_name" binding:"omitempty,min=2"`
	Phone    string `json:"phone" binding:"omitempty,min=10,max=20"`
	IsActive *bool  `json:"is_active"`
}

type UserResponse struct {
	ID        uuid.UUID  `json:"id"`
	Email     string     `json:"email"`
	Username  string     `json:"username"`
	FullName  string     `json:"full_name"`
	Phone     string     `json:"phone"`
	Avatar    string     `json:"avatar"`
	Role      string     `json:"role"`
	IsActive  bool       `json:"is_active"`
	LastLogin *time.Time `json:"last_login_at"`
}

// ===================== SANTRI =====================

type CreateSantriRequest struct {
	NIS          string `json:"nis" binding:"required,min=3"`
	FullName     string `json:"full_name" binding:"required,min=2"`
	Gender       string `json:"gender" binding:"required,oneof=L P"`
	PlaceOfBirth string `json:"place_of_birth"`
	DateOfBirth  string `json:"date_of_birth" binding:"required"` // YYYY-MM-DD
	Address      string `json:"address"`
	Phone        string `json:"phone"`
	ParentName   string `json:"parent_name" binding:"required"`
	ParentPhone  string `json:"parent_phone" binding:"required"`
	EntryYear    int    `json:"entry_year" binding:"required"`
	Class        string `json:"class"`
	Dormitory    string `json:"dormitory"`
}

type UpdateSantriRequest struct {
	FullName     string `json:"full_name" binding:"omitempty,min=2"`
	Phone        string `json:"phone"`
	Address      string `json:"address"`
	ParentName   string `json:"parent_name"`
	ParentPhone  string `json:"parent_phone"`
	Class        string `json:"class"`
	Dormitory    string `json:"dormitory"`
	Status       string `json:"status" binding:"omitempty,oneof=active alumni dropped"`
}

type SantriResponse struct {
	ID           uuid.UUID `json:"id"`
	NIS          string    `json:"nis"`
	FullName     string    `json:"full_name"`
	Gender       string    `json:"gender"`
	PlaceOfBirth string    `json:"place_of_birth"`
	DateOfBirth  time.Time `json:"date_of_birth"`
	Address      string    `json:"address"`
	Phone        string    `json:"phone"`
	Photo        string    `json:"photo"`
	ParentName   string    `json:"parent_name"`
	ParentPhone  string    `json:"parent_phone"`
	EntryYear    int       `json:"entry_year"`
	Class        string    `json:"class"`
	Dormitory    string    `json:"dormitory"`
	Status       string    `json:"status"`
	QRCode       string    `json:"qr_code"`
}

// ===================== ATTENDANCE =====================

type QRAttendanceRequest struct {
	QRCode string `json:"qr_code" binding:"required"`
}

type ManualAttendanceRequest struct {
	SantriID string `json:"santri_id" binding:"required,uuid"`
	Status   string `json:"status" binding:"required,oneof=present absent sick permission late"`
	Notes    string `json:"notes"`
}

type AttendanceFilter struct {
	SantriID string `form:"santri_id"`
	DateFrom string `form:"date_from"`
	DateTo   string `form:"date_to"`
	Status   string `form:"status"`
	Class    string `form:"class"`
}

// ===================== PAYMENT =====================

type CreatePaymentRequest struct {
	SantriID string  `json:"santri_id" binding:"required,uuid"`
	Type     string  `json:"type" binding:"required"`
	Amount   float64 `json:"amount" binding:"required,gt=0"`
	DueDate  string  `json:"due_date" binding:"required"`
	Period   string  `json:"period" binding:"required"`
	Notes    string  `json:"notes"`
}

type ConfirmPaymentRequest struct {
	PaidAmount    float64 `json:"paid_amount" binding:"required,gt=0"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
}

// ===================== ANNOUNCEMENT =====================

type CreateAnnouncementRequest struct {
	Title    string `json:"title" binding:"required,min=5"`
	Content  string `json:"content" binding:"required,min=10"`
	Category string `json:"category" binding:"required,oneof=umum akademik keuangan ppdb"`
	IsPublic *bool  `json:"is_public"`
}

type UpdateAnnouncementRequest struct {
	Title    string `json:"title" binding:"omitempty,min=5"`
	Content  string `json:"content" binding:"omitempty,min=10"`
	Category string `json:"category" binding:"omitempty,oneof=umum akademik keuangan ppdb"`
	IsPublic *bool  `json:"is_public"`
}

// ===================== PPDB =====================

type PPDBRegisterRequest struct {
	FullName       string `json:"full_name" binding:"required,min=2"`
	Gender         string `json:"gender" binding:"required,oneof=L P"`
	PlaceOfBirth   string `json:"place_of_birth" binding:"required"`
	DateOfBirth    string `json:"date_of_birth" binding:"required"`
	Address        string `json:"address" binding:"required"`
	PreviousSchool string `json:"previous_school" binding:"required"`
	ParentName     string `json:"parent_name" binding:"required"`
	ParentPhone    string `json:"parent_phone" binding:"required"`
	ParentEmail    string `json:"parent_email" binding:"omitempty,email"`
}

type PPDBReviewRequest struct {
	Status string `json:"status" binding:"required,oneof=reviewing accepted rejected"`
	Notes  string `json:"notes"`
}

// ===================== DASHBOARD =====================

type DashboardStats struct {
	TotalSantri      int64   `json:"total_santri"`
	TotalActive      int64   `json:"total_active"`
	TodayPresent     int64   `json:"today_present"`
	TodayAbsent      int64   `json:"today_absent"`
	TodaySick        int64   `json:"today_sick"`
	TodayPermission  int64   `json:"today_permission"`
	PendingPayments  int64   `json:"pending_payments"`
	OverduePayments  int64   `json:"overdue_payments"`
	MonthlyRevenue   float64 `json:"monthly_revenue"`
	PPDBRegistrations int64  `json:"ppdb_registrations"`
	AttendanceRate   float64 `json:"attendance_rate"`
}
