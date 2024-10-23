import sqlite3

from app import app
from .functions_db import insert_doctor, remove_doctors

doctors = [
    (23456730, 'Neumonia', 'Carlos', 'Gomez', 'carlos.gomez@hospital.com', 358123456789, '1980-05-15', 'Male'),
    (17345629, 'Tuberculosis', 'Ana', 'Martinez', 'ana.martinez@hospital.com', 358987654321, '1975-08-20', 'Female'),
    (26789228, 'Covid', 'Jose', 'Lopez', 'jose.lopez@hospital.com', 358112233445, '1988-12-05', 'Male'),
    (23456727, 'Neumonia', 'Maria', 'Fernandez', 'maria.fernandez@hospital.com', 358554433221, '1985-03-10', 'Female'),
    (23456726, 'Tuberculosis', 'Luis', 'Ramirez', 'luis.ramirez@hospital.com', 358667788990, '1990-01-22', 'Male'),
    (23456725, 'Covid', 'Sofia', 'Perez', 'sofia.perez@hospital.com', 358998877665, '1982-11-30', 'Female'),
    (23456724, 'Neumonia', 'Ricardo', 'Alvarez', 'ricardo.alvarez@hospital.com', 358334455667, '1979-07-18', 'Male'),
    (23456723, 'Tuberculosis', 'Laura', 'Gonzalez', 'laura.gonzalez@hospital.com', 358776655443, '1987-04-25', 'Female'),
    (23456722, 'Covid', 'Miguel', 'Sanchez', 'miguel.sanchez@hospital.com', 358445566778, '1991-09-13', 'Male'),
    (23456721, 'Neumonia', 'Juan', 'Paredes', 'juan.paredes@hospital.com', 358123123123, '1973-02-11', 'Male'),
    (23456720, 'Tuberculosis', 'Elena', 'Rojas', 'elena.rojas@hospital.com', 358321321321, '1984-06-14', 'Female'),
    (23456719, 'Covid', 'Fernando', 'Diaz', 'fernando.diaz@hospital.com', 358213213213, '1978-07-21', 'Male'),
    (23456718, 'Neumonia', 'Paula', 'Vega', 'paula.vega@hospital.com', 358654654654, '1983-09-12', 'Female'),
    (23456717, 'Tuberculosis', 'Diana', 'Ortiz', 'diana.ortiz@hospital.com', 358456456456, '1992-03-18', 'Female'),
    (23456716, 'Covid', 'Alberto', 'Mendoza', 'alberto.mendoza@hospital.com', 358789789789, '1986-12-09', 'Male'),
    (23456715, 'Neumonia', 'Gabriela', 'Mora', 'gabriela.mora@hospital.com', 358987987987, '1981-04-04', 'Female')
]


with app.app_context():
    for doctor in doctors:
        insert_doctor(*doctor)

