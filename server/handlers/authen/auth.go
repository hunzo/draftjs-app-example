package authen

import (
	"server/validate"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func Login(c *fiber.Ctx) error {
	t, err := validate.GenerateAccessToken("this is string payload")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.ErrInternalServerError)
	}
	return c.JSON(fiber.Map{
		"token": t,
	})
}

func Profile(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	return c.JSON(fiber.Map{
		"info":   "profile",
		"user":   user,
		"claims": claims,
		"role":   claims["role"],
	})
}
