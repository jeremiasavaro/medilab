import sqlite3

from app import app
from .functions_db import insert_doctor, remove_doctors

doctors = [
    (23456730, 'Pneumonologist', 'Carlos', 'Gomez', 'carlos.gomez@hospital.com', 358123456789, '1980-05-15', 'Male'),
    (17345629, 'Oncologist', 'Ana', 'Martinez', 'ana.martinez@hospital.com', 358987654321, '1975-08-20', 'Female'),
    (26789228, 'Cardiologist', 'Jose', 'Lopez', 'jose.lopez@hospital.com', 358112233445, '1988-12-05', 'Male'),
    (23456727, 'Pneumonologist', 'Maria', 'Fernandez', 'maria.fernandez@hospital.com', 358554433221, '1985-03-10', 'Female'),
    (23456726, 'Oncologist', 'Luis', 'Ramirez', 'luis.ramirez@hospital.com', 358667788990, '1990-01-22', 'Male'),
    (23456725, 'Cardiologist', 'Sofia', 'Perez', 'sofia.perez@hospital.com', 358998877665, '1982-11-30', 'Female'),
    (23456724, 'Pneumonologist', 'Ricardo', 'Alvarez', 'ricardo.alvarez@hospital.com', 358334455667, '1979-07-18', 'Male'),
    (23456723, 'Oncologist', 'Laura', 'Gonzalez', 'laura.gonzalez@hospital.com', 358776655443, '1987-04-25', 'Female'),
    (23456722, 'Cardiologist', 'Miguel', 'Sanchez', 'miguel.sanchez@hospital.com', 358445566778, '1991-09-13', 'Male'),
    (23456721, 'Pneumonologist', 'Juan', 'Paredes', 'juan.paredes@hospital.com', 358123123123, '1973-02-11', 'Male'),
    (23456720, 'Oncologist', 'Elena', 'Rojas', 'elena.rojas@hospital.com', 358321321321, '1984-06-14', 'Female'),
    (23456719, 'Cardiologist', 'Fernando', 'Diaz', 'fernando.diaz@hospital.com', 358213213213, '1978-07-21', 'Male'),
    (23456718, 'Pneumonologist', 'Paula', 'Vega', 'paula.vega@hospital.com', 358654654654, '1983-09-12', 'Female'),
    (23456717, 'Oncologist', 'Diana', 'Ortiz', 'diana.ortiz@hospital.com', 358456456456, '1992-03-18', 'Female'),
    (23456716, 'Cardiologist', 'Alberto', 'Mendoza', 'alberto.mendoza@hospital.com', 358789789789, '1986-12-09', 'Male'),
    (23456715, 'Pneumonologist', 'Gabriela', 'Mora', 'gabriela.mora@hospital.com', 358987987987, '1981-04-04', 'Female')
]


with app.app_context():
    remove_doctors()
    for doctor in doctors:
        insert_doctor(*doctor)
    print("Doctors inserted successfully")