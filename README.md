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

## Installation Guide

### Prerequisites

- **Python 3.7+**
- **Node.js & npm**
- **Pipenv or virtualenv (optional but recommended)**

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jeremiasavaro/medilab.git
   cd medilab/backend
   ```

2. Create a virtual environment and activate it:

   ```bash
   pipenv install
   pipenv shell
   ```

3. Navigate to the backend directory:

   ```bash
   cd medilab/backend
   ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Apply the migration to initialize the database:

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Run the Flask application:

   ```bash
   flask run
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd medilab/frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Install serve

   ```bash
   npm install -g serve
   ```

4. Create the build:

   ```bash
   npm run build
   ```

5. Run the build

    ```bash
   serve -s build
   ```

## Documentation Links

- [AI documentation](ia_models/docs/models/SVM_DOCUMENTATION.html)
  *Explore the details of our AI models, including training processes and performance metrics.*
- [Datasets and Acknowledgements](ia_models/docs/datasets/datasets_sources_and_aknowledgements.html)
 *Learn about the datasets used for training our models and the organizations or individuals who contributed.*

## Contact Information

For any questions, suggestions, or inquiries, feel free to reach out to us at:

**Email:**

- [ccornejomateo@gmail.com](mailto:ccornejomateo@gmail.com?subject=Inquiry%20about%20Medilab&body=Hello%20team,)
- [maximarquez2004@gmail.com](mailto:maximarquez2004@gmail.com?subject=Inquiry%20about%20Medilab&body=Hello%20team,)
- [jeremiasavaro7@gmail.com](mailto:jeremiasavaro7@gmail.com?subject=Inquiry%20about%20Medilab&body=Hello%20team,)
- [marcelo395juarez@gmail.com](mailto:marcelo395juarez@gmail.com?subject=Inquiry%20about%20Medilab&body=Hello%20team,)
- [fede.dalio1@gmail.com](mailto:fede.dalio1@gmail.com?subject=Inquiry%20about%20Medilab&body=Hello%20team,)
- [matiaspellizzari0@gmail.com](mailto:matiaspellizzari0@gmail.com?subject=Inquiry%20about%20Medilab&body=Hello%20team,)

**GitHub:**

- [Medilab Project](https://github.com/jeremiasavaro/medilab)
