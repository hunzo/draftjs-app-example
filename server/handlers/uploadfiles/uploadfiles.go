package uploadfiles

import (
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

const SERVER = "http://localhost:8080"

func ListFiles(c *fiber.Ctx) error {
	dirName := "./uploads"

	f, err := os.Open(dirName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	files, err := f.ReadDir(-1)
	f.Close()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	fileList := []string{}

	for _, file := range files {
		fileList = append(fileList, SERVER+"/static/"+file.Name())
		// fmt.Println(file.Name())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": fileList,
	})
}

func UploadsFile(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	uniqueID := uuid.New()

	fileName := strings.Replace(uniqueID.String(), "-", "", -1)
	fileExtension := strings.Split(file.Filename, ".")[1]
	_File := fmt.Sprintf("%s.%s", fileName, fileExtension)

	filePath := "./uploads/" + _File

	err = c.SaveFile(file, filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	fileURL := fmt.Sprintf("%s/static/%s", SERVER, _File)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success":          true,
		"cid":              fileName,
		"file_name":        file.Filename,
		"file_name_encode": _File,
		"file_sizes":       file.Size,
		"file_header":      file.Header,
		"file_url":         fileURL,
	})
}

func DeleteFile(c *fiber.Ctx) error {
	filename := c.Params("filename")

	err := os.Remove(fmt.Sprintf("./uploads/%s", filename))
	fmt.Printf("./uploads/%s", filename)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success":  false,
			"messages": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
		"message": "file: " + filename + " has been deleted.",
	})
}

func EmptyFiles(c *fiber.Ctx) error {
	directry := "./uploads/"

	dirRead, err := os.Open(directry)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success":  false,
			"messages": err.Error(),
		})
	}

	files, err := dirRead.ReadDir(0)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success":  false,
			"messages": err.Error(),
		})
	}

	var files_remove []string

	for index := range files {
		file := files[index]
		fileName := file.Name()
		filePath := directry + fileName

		os.Remove(filePath)
		files_remove = append(files_remove, filePath)
		fmt.Printf("remove file: %s\n", filePath)
	}

	return c.JSON(fiber.Map{
		"success":      true,
		"message":      "clear file",
		"remove_files": files_remove,
	})

}
