package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// Struct to hold the question and answer.
type QA struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

func main() {
	// Check if a command line argument is provided.
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run script.go [inputfile.csv]")
		return
	}

	inputFileName := os.Args[1]

	// Open the CSV file.
	csvFile, err := os.Open(inputFileName)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer csvFile.Close()

	// Read the file.
	reader := csv.NewReader(csvFile)
	reader.Comma = ';'
	lines, err := reader.ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Map to store the QAs.
	result := make(map[string]QA)

	// Iterate over the lines, skipping the header.
	for i, line := range lines {
		if i == 0 {
			continue // Skip header row.
		}
		result[strconv.Itoa(i-1)] = QA{
			Question: line[0],
			Answer:   line[1],
		}
	}

	// Convert map to JSON.
	jsonData, err := json.Marshal(result)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Construct JSON filename from input filename.
	outputFileName := strings.TrimSuffix(inputFileName, filepath.Ext(inputFileName)) + ".json"

	// Write JSON to file.
	jsonFile, err := os.Create(outputFileName)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer jsonFile.Close()
	jsonFile.Write(jsonData)

	fmt.Println("JSON file created successfully:", outputFileName)
}
