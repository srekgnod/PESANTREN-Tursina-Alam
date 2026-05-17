package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseModel provides common fields for all entities
type BaseModel struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// ===================== USER & AUTH =====================

type Role string

const (
	RoleSuperAdmin Role = "super_admin"
	RoleAdmin      Role = "admin"
	RolePengurus   Role = "pengurus"
	RoleUstadz     Role = "ustadz"
	RoleWali       Role = "wali_santri"
	RoleSantri     Role = "santri"
)

type User struct {
	BaseModel
	Email       string  `gorm:"uniqueIndex;size:255;not null" json:"email"`
	Username    string  `gorm:"uniqueIndex;size:100;not null" json:"username"`
	Password    string  `gorm:"size:255;not null" json:"-"`
	FullName    string  `gorm:"size:255;not null" json:"full_name"`
	Phone       string  `gorm:"size:20" json:"phone"`
	Avatar      string  `gorm:"size:500" json:"avatar"`
	Role        Role    `gorm:"size:20;not null;index" json:"role"`
	IsActive    bool    `gorm:"default:true" json:"is_active"`
	LastLoginAt *time.Time `json:"last_login_at"`

	// Relations
	Sessions    []Session    `gorm:"foreignKey:UserID" json:"-"`
	AuditTrails []AuditTrail `gorm:"foreignKey:UserID" json:"-"`
}

type Session struct {
	BaseModel
	UserID       uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	RefreshToken string    `gorm:"size:500;not null" json:"-"`
	UserAgent    string    `gorm:"size:500" json:"user_agent"`
	IPAddress    string    `gorm:"size:45" json:"ip_address"`
	ExpiresAt    time.Time `json:"expires_at"`
	User         User      `gorm:"foreignKey:UserID" json:"-"`
}

type Permission struct {
	BaseModel
	Name        string `gorm:"uniqueIndex;size:100;not null" json:"name"`
	Description string `gorm:"size:255" json:"description"`
	Module      string `gorm:"size:50;index" json:"module"`
}

type RolePermission struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Role         Role      `gorm:"size:20;not null;index" json:"role"`
	PermissionID uuid.UUID `gorm:"type:uuid;not null;index" json:"permission_id"`
	Permission   Permission `gorm:"foreignKey:PermissionID" json:"permission"`
}

// ===================== SANTRI =====================

type Gender string

const (
	GenderMale   Gender = "L"
	GenderFemale Gender = "P"
)

type Santri struct {
	BaseModel
	NIS           string    `gorm:"uniqueIndex;size:20;not null" json:"nis"`
	FullName      string    `gorm:"size:255;not null" json:"full_name"`
	Gender        Gender    `gorm:"size:1;not null" json:"gender"`
	PlaceOfBirth  string    `gorm:"size:100" json:"place_of_birth"`
	DateOfBirth   time.Time `json:"date_of_birth"`
	Address       string    `gorm:"type:text" json:"address"`
	Phone         string    `gorm:"size:20" json:"phone"`
	Photo         string    `gorm:"size:500" json:"photo"`
	ParentName    string    `gorm:"size:255" json:"parent_name"`
	ParentPhone   string    `gorm:"size:20" json:"parent_phone"`
	EntryYear     int       `gorm:"not null;index" json:"entry_year"`
	Class         string    `gorm:"size:20;index" json:"class"`
	Dormitory     string    `gorm:"size:50" json:"dormitory"`
	Status        string    `gorm:"size:20;default:'active';index" json:"status"` // active, alumni, dropped
	QRCode        string    `gorm:"size:500" json:"qr_code"`
	UserID        *uuid.UUID `gorm:"type:uuid;index" json:"user_id"`
	WaliUserID    *uuid.UUID `gorm:"type:uuid;index" json:"wali_user_id"`

	// Relations
	User        *User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	WaliUser    *User        `gorm:"foreignKey:WaliUserID" json:"wali_user,omitempty"`
	Attendances []Attendance `gorm:"foreignKey:SantriID" json:"-"`
	Payments    []Payment    `gorm:"foreignKey:SantriID" json:"-"`
	Hafalan     []Hafalan    `gorm:"foreignKey:SantriID" json:"-"`
}

// ===================== PENGURUS =====================

type Pengurus struct {
	BaseModel
	NIP      string     `gorm:"uniqueIndex;size:20;not null" json:"nip"`
	FullName string     `gorm:"size:255;not null" json:"full_name"`
	Position string     `gorm:"size:100" json:"position"`
	Phone    string     `gorm:"size:20" json:"phone"`
	Photo    string     `gorm:"size:500" json:"photo"`
	UserID   *uuid.UUID `gorm:"type:uuid;index" json:"user_id"`
	IsActive bool       `gorm:"default:true" json:"is_active"`
	User     *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// ===================== ATTENDANCE =====================

type AttendanceStatus string

const (
	AttendancePresent    AttendanceStatus = "present"
	AttendanceAbsent     AttendanceStatus = "absent"
	AttendanceSick       AttendanceStatus = "sick"
	AttendancePermission AttendanceStatus = "permission"
	AttendanceLate       AttendanceStatus = "late"
)

type Attendance struct {
	BaseModel
	SantriID  uuid.UUID        `gorm:"type:uuid;not null;index" json:"santri_id"`
	Date      time.Time        `gorm:"type:date;not null;index" json:"date"`
	Status    AttendanceStatus `gorm:"size:20;not null" json:"status"`
	CheckIn   *time.Time       `json:"check_in"`
	CheckOut  *time.Time       `json:"check_out"`
	Method    string           `gorm:"size:20;default:'qr'" json:"method"` // qr, manual
	Notes     string           `gorm:"size:500" json:"notes"`
	ScannedBy *uuid.UUID       `gorm:"type:uuid" json:"scanned_by"`
	Santri    Santri           `gorm:"foreignKey:SantriID" json:"santri,omitempty"`
}

// ===================== HAFALAN =====================

type Hafalan struct {
	BaseModel
	SantriID  uuid.UUID `gorm:"type:uuid;not null;index" json:"santri_id"`
	Surah     string    `gorm:"size:100;not null" json:"surah"`
	JuzNumber int       `gorm:"not null" json:"juz_number"`
	AyahFrom  int       `json:"ayah_from"`
	AyahTo    int       `json:"ayah_to"`
	Grade     string    `gorm:"size:5" json:"grade"` // A, B, C, D
	Notes     string    `gorm:"size:500" json:"notes"`
	TestedBy  *uuid.UUID `gorm:"type:uuid" json:"tested_by"`
	TestedAt  time.Time  `json:"tested_at"`
	Santri    Santri     `gorm:"foreignKey:SantriID" json:"-"`
}

// ===================== PAYMENT =====================

type PaymentStatus string

const (
	PaymentPending  PaymentStatus = "pending"
	PaymentPaid     PaymentStatus = "paid"
	PaymentOverdue  PaymentStatus = "overdue"
	PaymentCanceled PaymentStatus = "canceled"
)

type Payment struct {
	BaseModel
	SantriID      uuid.UUID     `gorm:"type:uuid;not null;index" json:"santri_id"`
	InvoiceNumber string        `gorm:"uniqueIndex;size:50;not null" json:"invoice_number"`
	Type          string        `gorm:"size:50;not null;index" json:"type"` // spp, registration, uniform, etc
	Amount        float64       `gorm:"not null" json:"amount"`
	PaidAmount    float64       `gorm:"default:0" json:"paid_amount"`
	Status        PaymentStatus `gorm:"size:20;not null;default:'pending';index" json:"status"`
	DueDate       time.Time     `json:"due_date"`
	PaidAt        *time.Time    `json:"paid_at"`
	PaymentMethod string        `gorm:"size:50" json:"payment_method"`
	Receipt       string        `gorm:"size:500" json:"receipt"`
	Notes         string        `gorm:"size:500" json:"notes"`
	Period        string        `gorm:"size:20;index" json:"period"` // 2026-01, 2026-02...
	Santri        Santri        `gorm:"foreignKey:SantriID" json:"santri,omitempty"`
}

// ===================== ANNOUNCEMENT =====================

type Announcement struct {
	BaseModel
	Title     string     `gorm:"size:255;not null" json:"title"`
	Content   string     `gorm:"type:text;not null" json:"content"`
	Category  string     `gorm:"size:50;index" json:"category"` // umum, akademik, keuangan, ppdb
	Image     string     `gorm:"size:500" json:"image"`
	IsPublic  bool       `gorm:"default:true" json:"is_public"`
	AuthorID  uuid.UUID  `gorm:"type:uuid;not null" json:"author_id"`
	PublishAt *time.Time `json:"publish_at"`
	Author    User       `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
}

// ===================== PPDB =====================

type PPDBStatus string

const (
	PPDBRegistered PPDBStatus = "registered"
	PPDBReviewing  PPDBStatus = "reviewing"
	PPDBAccepted   PPDBStatus = "accepted"
	PPDBRejected   PPDBStatus = "rejected"
)

type PPDBRegistration struct {
	BaseModel
	RegistrationNumber string     `gorm:"uniqueIndex;size:30;not null" json:"registration_number"`
	FullName           string     `gorm:"size:255;not null" json:"full_name"`
	Gender             Gender     `gorm:"size:1;not null" json:"gender"`
	PlaceOfBirth       string     `gorm:"size:100" json:"place_of_birth"`
	DateOfBirth        time.Time  `json:"date_of_birth"`
	Address            string     `gorm:"type:text" json:"address"`
	PreviousSchool     string     `gorm:"size:255" json:"previous_school"`
	ParentName         string     `gorm:"size:255;not null" json:"parent_name"`
	ParentPhone        string     `gorm:"size:20;not null" json:"parent_phone"`
	ParentEmail        string     `gorm:"size:255" json:"parent_email"`
	Documents          string     `gorm:"type:text" json:"documents"` // JSON array of doc URLs
	Status             PPDBStatus `gorm:"size:20;default:'registered';index" json:"status"`
	AcademicYear       string     `gorm:"size:10;index" json:"academic_year"`
	Notes              string     `gorm:"type:text" json:"notes"`
	ReviewedBy         *uuid.UUID `gorm:"type:uuid" json:"reviewed_by"`
	ReviewedAt         *time.Time `json:"reviewed_at"`
}

// ===================== SANTRI LEAVE (PERIZINAN) =====================

type LeaveStatus string

const (
	LeavePending  LeaveStatus = "pending"
	LeaveApproved LeaveStatus = "approved"
	LeaveRejected LeaveStatus = "rejected"
	LeaveCompleted LeaveStatus = "completed"
)

type SantriLeave struct {
	BaseModel
	SantriID    uuid.UUID   `gorm:"type:uuid;not null;index" json:"santri_id"`
	Type        string      `gorm:"size:30;not null;index" json:"type"` // pulang, sakit, keperluan, lainnya
	Reason      string      `gorm:"type:text;not null" json:"reason"`
	DateFrom    time.Time   `gorm:"type:date;not null" json:"date_from"`
	DateTo      time.Time   `gorm:"type:date;not null" json:"date_to"`
	Document    string      `gorm:"size:500" json:"document"`
	Status      LeaveStatus `gorm:"size:20;not null;default:'pending';index" json:"status"`
	ApprovedBy  *uuid.UUID  `gorm:"type:uuid" json:"approved_by"`
	ApprovedAt  *time.Time  `json:"approved_at"`
	RejectNote  string      `gorm:"size:500" json:"reject_note"`
	ReturnedAt  *time.Time  `json:"returned_at"`
	RequestedBy uuid.UUID   `gorm:"type:uuid;not null" json:"requested_by"` // wali or staff
	Santri      Santri      `gorm:"foreignKey:SantriID" json:"santri,omitempty"`
	Approver    *User       `gorm:"foreignKey:ApprovedBy" json:"approver,omitempty"`
}

// ===================== SANTRI NOTE =====================

type SantriNote struct {
	BaseModel
	SantriID uuid.UUID `gorm:"type:uuid;not null;index" json:"santri_id"`
	Type     string    `gorm:"size:30;not null;index" json:"type"` // pelanggaran, prestasi, catatan
	Title    string    `gorm:"size:255;not null" json:"title"`
	Content  string    `gorm:"type:text" json:"content"`
	AuthorID uuid.UUID `gorm:"type:uuid;not null" json:"author_id"`
	Santri   Santri    `gorm:"foreignKey:SantriID" json:"-"`
	Author   User      `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
}

// ===================== WHATSAPP NOTIFICATION =====================

type WAStatus string

const (
	WAPending   WAStatus = "pending"
	WASent      WAStatus = "sent"
	WAFailed    WAStatus = "failed"
	WAScheduled WAStatus = "scheduled"
)

type WANotification struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Phone       string    `gorm:"size:20;not null;index" json:"phone"`
	Message     string    `gorm:"type:text;not null" json:"message"`
	Type        string    `gorm:"size:30;not null;index" json:"type"` // payment_reminder, attendance, announcement, permission
	Status      WAStatus  `gorm:"size:20;not null;default:'pending';index" json:"status"`
	RetryCount  int       `gorm:"default:0" json:"retry_count"`
	Error       string    `gorm:"size:500" json:"error"`
	ScheduledAt *time.Time `json:"scheduled_at"`
	SentAt      *time.Time `json:"sent_at"`
	EntityID    string    `gorm:"size:50" json:"entity_id"`
	EntityType  string    `gorm:"size:50" json:"entity_type"`
	CreatedAt   time.Time `json:"created_at"`
}

// ===================== AUDIT TRAIL =====================

type AuditTrail struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	Action    string    `gorm:"size:50;not null;index" json:"action"` // create, update, delete, login, etc
	Module    string    `gorm:"size:50;not null;index" json:"module"`
	EntityID  string    `gorm:"size:50" json:"entity_id"`
	OldValues string    `gorm:"type:text" json:"old_values"`
	NewValues string    `gorm:"type:text" json:"new_values"`
	IPAddress string    `gorm:"size:45" json:"ip_address"`
	UserAgent string    `gorm:"size:500" json:"user_agent"`
	CreatedAt time.Time `json:"created_at"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// AllModels returns all models for auto-migration
func AllModels() []interface{} {
	return []interface{}{
		&User{},
		&Session{},
		&Permission{},
		&RolePermission{},
		&Santri{},
		&Pengurus{},
		&Attendance{},
		&Hafalan{},
		&Payment{},
		&Announcement{},
		&PPDBRegistration{},
		&SantriLeave{},
		&SantriNote{},
		&WANotification{},
		&AuditTrail{},
	}
}
