# Medilab

## Overview

This project aims to develop a web application in the field of medicine, specialized in the analysis and diagnosis of X-ray images. The application will use artificial intelligence to process and evaluate medical images, providing fast and accurate diagnoses that can assist patients. health professionals in clinical decision making.
## Features

- **AI-Driven Backend:** 
  - A RESTful JSON API built with Python and Flask handles backend logic, processes requests from the frontend, and communicates with the AI engine.
  
- **Dynamic Frontend:** 
  - The frontend is developed using React, providing a responsive and interactive user interface. It communicates with the backend to fetch AI-powered insights and present them to the user.
  
- **AI Engine:**
  - TensorFlow
  - Keras
  - numPY

## Installation

### Prerequisites:

- **Python 3.7+**
- **Node.js & npm**
- **Pipenv or virtualenv (optional but recommended)**

### Backend Setup:

1. Clone the repository:
   ```bash
   git clone https://github.com/Baachi13/proyecto-UNRC-2024.git
   cd proyecto-UNRC-2024.git/backend
2. Create a virtual environment and activate it:
   ```bash
   pipenv install
   pipenv shell
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
4. Run the Flask application:
   ```bash
   flask run

### Frontend Setup:

1. Navigate to the frontend directory:
   ```bash
   cd proyecto-UNRC-2024.git/frontend
2. Install the required dependencies:
   ```bash
   npm install
3. Install serve
   ```bash
   npm install -g serve
4. Create the build:
   ```bash
   npm run build
5. Run the build
    ```bash
   serve -s build

## Contact
For any questions or inquiries, please contact jeremiasavaro7@gmail.com.
