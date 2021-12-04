package routes

import (
	"server/handlers/authen"
	"server/handlers/uploadfiles"
	"server/validate"

	"github.com/gofiber/fiber/v2"
)

func SetupRouters(r *fiber.App) {
	public := r.Group("/")
	public.Post("/login", authen.Login)

	private := r.Group("/api", validate.AuthedRequired())
	private.Get("/profile", authen.Profile)

	uploadfile := private.Group("/files")
	// path : /api/files/*
	uploadfile.Get("/list", uploadfiles.ListFiles)
	uploadfile.Post("/upload", uploadfiles.UploadsFile)
	uploadfile.Delete("/delete/:filename", uploadfiles.DeleteFile)
	uploadfile.Post("/empty", uploadfiles.EmptyFiles)

	// path: /api/email/*

}
