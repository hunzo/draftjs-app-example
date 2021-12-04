package validate

import (
	"time"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/golang-jwt/jwt/v4"
)

const JWT_SECRET = "JWT_SECRET"
const TIME_EXPIRES = 60

func GenerateAccessToken(payload string) (string, error) {
	claims := jwt.MapClaims{
		"payload":    payload,
		"role":       "admin",
		"token_type": "access_token",
		"exp":        time.Now().Add(time.Minute * TIME_EXPIRES).Unix(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	token, err := jwtToken.SignedString([]byte(JWT_SECRET))

	if err != nil {
		return "", err
	}

	return token, nil
}

func AuthedRequired() func(c *fiber.Ctx) error {
	config := jwtware.Config{
		SigningKey:   []byte(JWT_SECRET),
		ErrorHandler: jwtError,
	}
	return jwtware.New(config)
}

func jwtError(c *fiber.Ctx, err error) error {
	// Return status 401 and failed authentication error.
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"code":    400,
			"message": err.Error(),
		})
	}

	// Return status 401 and failed authentication error.
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.ErrUnauthorized)
}
