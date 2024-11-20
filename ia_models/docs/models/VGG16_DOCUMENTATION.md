# Documentación del Modelo de IA para Diagnóstico Médico con VGG16

## Introducción

Este proyecto utiliza una red neuronal convolucional basada en la arquitectura VGG16 preentrenada para la clasificación de imágenes de rayos X de tórax en dos categorías: **normal** y **enfermedad**.  
La finalidad es apoyar en diagnósticos médicos automatizados, ofreciendo una herramienta efectiva y precisa.

## Tabla de Contenidos

- [Introducción](#introducción)
- [Preprocesamiento de Imágenes](#preprocesamiento-de-imágenes)
- [División de Datos](#división-de-datos)
- [Aumentación de Datos](#aumentación-de-datos)
- [Entrenamiento y Evaluación](#entrenamiento-y-evaluación)
- [Conclusión](#conclusión)

## Preprocesamiento de Imágenes

### 1. Lectura y Redimensionamiento

Las imágenes fueron cargadas desde subcarpetas (`NORMAL`, `ENFERMEDAD`). Se redimensionaron a 224x224 píxeles, el tamaño requerido por la arquitectura VGG16.

```python
for i in os.listdir(ruta_train):
    for j in os.listdir(ruta_train + i):
        img = cv2.imread(ruta_train + i + '/' + j, cv2.IMREAD_GRAYSCALE)
        if img is None:
            continue

        resized = cv2.resize(img, (224, 224))
        resized = resized / 255.0
        resized = np.stack((resized,)*3, axis=-1)
        train_x.append(resized)
        train_y.append([0, 1] if i == 'NORMAL' else [1, 0])
```

### 2. Normalización

Se dividió cada pixel entre 255 para normalizar los valores en un rango de 0 a 1.

### 3. Conversión de escala de grises a RGB

Se replicaron los valores en los 3 canales (RGB), adaptándolos al input requerido por VGG16.

## División de Datos

Los datos se dividieron en un 80% para entrenamiento y un 20% para validación mediante `train_test_split`.

```python
x_train, x_val, y_train, y_val = train_test_split(x_data, y_data, test_size=0.2, random_state=42)
```

## Aumentación de Datos

Para mejorar la robustez del modelo, se implementó aumentación de datos mediante `ImageDataGenerator`. Estas transformaciones incluyen:

- Rotaciones aleatorias hasta 20 grados
- Zoom aleatorio hasta un 15%
- Desplazamientos horizontales y verticales hasta un 20%
- Volteos horizontales

```python
datagen = ImageDataGenerator(
    rotation_range=20,
    zoom_range=0.15,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True
)
```

## Entrenamiento y Evaluación

El modelo se entrenó en dos fases:

- **Entrenamiento Inicial:**  
  Se congelaron las capas convolucionales de VGG16, permitiendo el ajuste de las capas añadidas específicamente para este problema.
  
- **Fine-Tuning:**  
  Tras un entrenamiento inicial, se habilitaron todas las capas del modelo para un ajuste completo.

- **Evaluación:**  
  Luego de cada fase, se evaluó el modelo con los datos de validación para medir su precisión.

```python
# Entrenamiento inicial
history = model.fit(
    datagen.flow(x_train, y_train, batch_size=batch_size),
    validation_data=(x_val, y_val),
    epochs=epochs,
    steps_per_epoch=len(x_train) // batch_size,
    verbose=1
)

# Evaluación inicial
val_loss, val_acc = model.evaluate(x_val, y_val, verbose=2)
print(f"Validation accuracy: {val_acc}")

# Fine-Tuning
base_model.trainable = True
model.compile(loss='categorical_crossentropy', optimizer=tf.keras.optimizers.Adam(1e-5), metrics=['accuracy'])
history_finetune = model.fit(
    datagen.flow(x_train, y_train, batch_size=batch_size),
    validation_data=(x_val, y_val),
    epochs=5,
    steps_per_epoch=len(x_train) // batch_size,
    verbose=1
)

# Evaluación final
val_loss, val_acc = model.evaluate(x_val, y_val, verbose=2)
print(f"Validation accuracy after fine-tuning: {val_acc}")

# Guardar el modelo
model.save('modelo_vgg16_finetuned.keras')
```

## Conclusión

Este modelo utiliza redes convolucionales, técnicas de fine-tuning y aumentación de datos, para abordar el desafío de clasificar imágenes médicas de manera precisa y eficiente. En esta documentación, se describe el flujo del desarrollo, desde la preparación de los datos hasta la evaluación del modelo entrenado.
Este enfoque inicial establece una base para la integración de herramientas de inteligencia artificial en el campo del diagnóstico médico, con potencial para ser optimizado y ampliado en futuras investigaciones.