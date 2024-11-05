# Documentación del Modelo de IA para Diagnóstico Médico

## Introducción

Este proyecto tiene como objetivo desarrollar una aplicación de inteligencia artificial para realizar diagnósticos médicos a través de imágenes de rayos X del torso. La aplicación web utiliza un modelo de IA entrenado específicamente para analizar estas imágenes y determinar si un paciente se encuentra en estado normal o si presenta signos de de alguna enfermedad. Este modelo en particular está entrenado para clasificar personas en estado de salud **normal** y personas con **neumonía**.

El modelo de IA fue entrenado utilizando un **Support Vector Machine (SVM)** con kernel lineal, el cual es adecuado para este tipo de clasificación binaria. La elección de un SVM permite que el modelo encuentre un hiperplano que maximice la separación entre las clases normal y neumonía, asegurando así un diagnóstico preciso. El modelo fue configurado con `probability=True` para obtener no solo la predicción de clase, sino también la probabilidad asociada a cada predicción, lo cual es crucial para proporcionar un nivel de confianza en los diagnósticos.

A lo largo del desarrollo de este proyecto, se realizaron múltiples análisis y evaluaciones para asegurar la precisión y la confiabilidad del modelo. La documentación detalla los pasos y decisiones clave en el proceso de entrenamiento, validación y pruebas, proporcionando una visión clara del funcionamiento y las capacidades del modelo.

## Montaje de Google Drive

Para facilitar el acceso a los datos, se monta Google Drive en el entorno de Colab, permitiendo leer las imágenes de rayos X almacenadas en la carpeta de Drive configurada para este proyecto.

## Lectura y Preprocesamiento de Imágenes

Para entrenar el modelo, es esencial que todas las imágenes tengan el mismo tamaño y formato. Las imágenes en el dataset están redimensionadas a `512x512` píxeles para que sean uniformes y convertidas a escala de grises. Luego, cada imagen se convierte en un vector unidimensional para poder ser procesada por el modelo.

```python
IMG_SIZE = (512, 512)
```

La función `load_images_from_folder` toma como entrada la carpeta y una etiqueta (0 para NORMAL y 1 para PNEUMONIA) y devuelve dos listas: una con las imágenes convertidas a vectores y otra con las etiquetas correspondientes.
En el caso de este entrenamiento, se utilizó un tamaño de imagen de `512x512` píxeles, el vector resultante unidimencional perteneciente a esa imagen tendrá un tamaño de `262.144` elementos.

```python
def load_images_from_folder(folder, label):
    images = []
    labels = []
    for filename in os.listdir(folder):
        img_path = os.path.join(folder, filename)
        try:
            img = Image.open(img_path).convert('L')  # Convertir a escala de grises
            img = img.resize(IMG_SIZE)  # Redimensionar las imágenes
            img_array = np.array(img).flatten()  # Convertir la imagen a un vector 1D
            images.append(img_array)
            labels.append(label)
        except Exception as e:
            print(f'Error al procesar {filename}: {e}')
    return images, labels
```

Esta función retorna dos listas para el `folder` pasado como parámetro:

* `normal_images` y `pneumonia_images`: listas que contienen las imágenes como arrays unidimensionales.
* `normal_labels` y `pneumonia_labels`: listas de etiquetas binarias que corresponden a cada imagen (0 para NORMAL y 1 para PNEUMONIA).

### Asignación de Etiquetas y Combinación de Datos

Las imágenes se agrupan en dos clases con sus respectivas etiquetas binarias, (`0`) **NORMAL** y (`1`) **PNEUMONIA**. Posteriormente, las imágenes y etiquetas de ambas clases se combinan en una única lista, que se convierte a arrays de NumPy para su procesamiento por el modelo.

```python
normal_images, normal_labels = load_images_from_folder(os.path.join(dataset_path, 'NORMAL'), 0)
pneumonia_images, pneumonia_labels = load_images_from_folder(os.path.join(dataset_path, 'PNEUMONIA'), 1)
```

### Combinar las imágenes y las etiquetas

Se concatenan las listas normal_images y pneumonia_images en una sola lista X, que contiene todas las imágenes del dataset. Análogamente con las labels.

```python
X = normal_images + pneumonia_images
y = normal_labels + pneumonia_labels
```

### Conversión a Arrays de NumPy

Las listas combinadas `X` e `y` se convierten en arrays de NumPy. Esto es importante para que los datos sean compatibles con las operaciones que se realizarán en el entrenamiento del modelo.

```python
X = np.array(X)
y = np.array(y)
```

### Separación en Conjuntos de Entrenamiento y Validación

Para evaluar el rendimiento del modelo, se divide el conjunto de datos en un 80% para entrenamiento y un 20% para validación. Esto se realiza utilizando `train_test_split` con una semilla (`random_state=42`).

```python
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
```

## Entrenamiento

Se entrena un modelo de clasificación SVM (Support Vector Machine) con kernel lineal, y se evalúa su rendimiento en el conjunto de validación. Este tipo de kernel es útil cuando los datos son linealmente separables.
Para entrenar el modelo, utilizamos SVC de la biblioteca scikit-learn. Este modelo SVM es adecuado para problemas de clasificación binaria, como en este caso, donde el objetivo es clasificar las imágenes en una de dos categorías: "Normal" o "Neumonía"

```python
svm_model = SVC(kernel='linear', probability=True)
svm_model.fit(X_train, y_train)
```

`SVC` significa **Support Vector Classifier**. Es una implementación específica de SVM en la biblioteca scikit-learn de Python, diseñada específicamente para tareas de clasificación.

Con un algoritmo SVM, se calculará la relación entre cada par de puntos y, finalmente, dibujará el SVC a partir de ahí.

![Ejemplo sin clasificar](images/example_SVM_img1.jpg)  
*Figura 1: Datos de ejemplo sin clasificar.*

Los puntos se vuelven linealmente separables, ya que podemos dibujar el SVC Lineal óptimo de la siguiente manera:

![Ejemplo clasificado](images/example_SVM_img2.jpg)  
*Figura 2: Clasificación de los datos con SVC Lineal.*

Fuente: [StrataScratch - Machine Learning Algorithms Explained: Support Vector Machine](https://www.stratascratch.com/blog/machine-learning-algorithms-explained-support-vector-machine/)

## Evaluación

Se evalúa el rendimiento del modelo en el conjunto de validación utilizando métricas de precisión, recall y F1 score, que permiten ver la eficacia del modelo al clasificar entre las clases "NORMAL" y "PNEUMONIA".

```python
# Predicciones en el conjunto de validación
y_pred = svm_model.predict(X_val)

# Evaluación del modelo
print("SVM Accuracy:", accuracy_score(y_val, y_pred))  # Precisión general del modelo
print(classification_report(y_val, y_pred))  # Informe detallado con precisión, recall y F1 score
```

![Estadisticas](images/svm_val_evaluation.jpg)  
*Figura 3: Informe detallado con presicion, recall, f1 score para ambas clases.*

### Predicciones con Probabilidades en el Conjunto de Validación

Como una característica de nuestro servicio, se obtienen las probabilidades de pertenencia a cada clase para las predicciones en el conjunto de validación, lo que permite observar con qué grado de confianza el modelo clasifica cada caso como **NORMAL** o **PNEUMONIA**.

```python
# Predicciones con probabilidades en el conjunto de validación
y_pred_proba = svm_model.predict_proba(X_val)  # Devuelve las probabilidades para cada clase

# Mostrar las primeras predicciones con sus porcentajes de confianza
for i in range(5):  # Muestra solo las primeras 5 como ejemplo
    print(f"Predicción: {y_pred[i]}, Probabilidad de clase 0 (normal): {y_pred_proba[i][0]:.2f}, Probabilidad de clase 1 (neumonía): {y_pred_proba[i][1]:.2f}")
```

## Vizualización de imagen

Aqui se puede observar una imagen de la clase normal de los datos que toma el modelo para entrenarse. Esta imagen son los `512x512` píxeles representados nuevamente en una imagen.

```python
import matplotlib.pyplot as plt
img = X[0].reshape(512, 512)
plt.imshow(img, cmap='gray')
plt.show()
```

![primer_elemento_claseNormal](images/normal_img_representation_from_trained_data.jpg)
*Figura 4: una imagen perteneciente a la clase Normal.*

## Cross-Validaton

