package main

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type TokenRequest struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
}

type TokenResponse struct {
	Token string `json:"token"`
}

func tokenHandler(w http.ResponseWriter, r *http.Request) {
	var req TokenRequest
	json.NewDecoder(r.Body).Decode(&req)

	claims := jwt.MapClaims{
		"sub":   req.UserID,
		"email": req.Email,
		"exp":   time.Now().Add(time.Hour).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, _ := token.SignedString(jwtSecret)

	json.NewEncoder(w).Encode(TokenResponse{Token: signed})
}

func checkHandler(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	tokenStr := auth[len("Bearer "):]

	_, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func main() {
	http.HandleFunc("/token", tokenHandler)
	http.HandleFunc("/check", checkHandler)

	http.ListenAndServe(":8080", nil)
}
