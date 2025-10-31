# decisiones.md - TP05 Release Pipelines - Ing Software 3
**Desarrollo con Azure DevOps + Azure Web Apps**

## 1. Configuración de recursos

### 1.1. Crear un Resource Group
En la barra de búsqueda voy a "Grupos de recursos", hago click en _Crear_ y completo los campos con:
- Suscripción: Azure for students
- Nombre: rg-tp05-ingsoft3-2025
- Región: East US
![alt text](image.png)

### 1.2. Crear las Web Apps de QA y Prod
#### Web App QA
En la barra de búsqueda voy a "App Services", hago click en Crear --> Aplicación Web y completo los campos con:
- Suscripción: Azure for students
- Grupo de recursos: `rg-tp05-ingsoft3-2025`
- Nombre: `webapp-tp05-qa-treachi`
- Publicar: Código
- Pila del entorno en tiempo de ejecución: `Node 20 LTS`
- Sistema operativo: Windows
- Región: East US 2
![alt text](image-1.png)

Creo un plan de App Services con el nombre `plan-tp05-free`
![alt text](image-2.png)

Reviso que esté todo bien y creo la Web App QA:
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)

#### Web App PROD
En la barra de búsqueda voy de vuelta a "App Services", hago click en Crear --> Aplicación Web y completo los campos con:
- Suscripción: Azure for students
- Grupo de recursos: `rg-tp05-ingsoft3-2025`
- Nombre: `webapp-tp05-prod-treachi`
- Publicar: Código
- Pila del entorno en tiempo de ejecución: `Node 20 LTS`
- Sistema operativo: Windows
- Región: East US 2
- Plan: `plan-tp05-free`
![alt text](image-6.png)
![alt text](image-7.png)

Reviso que esté todo bien y creo la Web App PROD:
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)

Web Apps creadas:
![alt text](image-11.png)

Recursos creados:
![alt text](image-12.png)

## 2. Configuración de Service Connection en Azure DevOps
### 2.1. Crear Service Connection

Voy a Azure DevOps y creo un nuevo proyecto para este TP:
![alt text](image-13.png)
![alt text](image-14.png)

Voy a _Project Settings_ --> _Service Connection_ --> _Create service connection_
![alt text](image-15.png)

Elijo:
- Azure Resource Manager
![alt text](image-16.png)
- Completo con los siguientes datos:
![alt text](image-17.png)

![alt text](image-18.png)

## 3. Creación de Pipeline YAML básico (solo CI)
### 3.1. Crear archivo azure-pipelines.yml
En la raíz del repositorio creo el archivo `azure-pipelines.yml` con un Pipeline YAML básico.

### 3.2. Crear el pipeline en Azure DevOps
Voy a _Pipelines_ --> _Create Pipeline_ --> _GitHub_ 
Selecciono el repositorio en GitHub donde tengo la aplicación que voy a usar para este TP: TP05_ReleasePipelines_ISW3. Automáticamente detecta el archivo `azure-pipelines.yml` y hago click en _RUN_.

## 4. Verificación del build inicial
### 4.1. Verificar ejecución del pipeline
Podemos ver que el pipeline se ejecutó exitosamente:
![alt text](image-19.png)
Los artifacts se publicaron correctamente:
![alt text](image-20.png)

## 5. Extensión del pipeline para incluir deploy a QA
### 5.1. Crear Environments en Azure DevOps
Voy a _Pipelines_ --> _Environments_ --> _Create environment_
Creo los environments para QA y PROD
![alt text](image-21.png)
![alt text](image-22.png)
En el de PROD agrego aprobación manual
![alt text](image-23.png)
Me agrego como aprobadora:
![alt text](image-24.png)
![alt text](image-25.png)

### 5.2 Actualizar azure-pipelines.yml para incluir CD
Modifico el `azure-pipelines.yml` con un nuevo stage para el Deploy a QA. 

## 6. Prueba de Deployment a QA
### 6.1 Hago commit y push
Hago commit y push de los cambios:
```bash
git add .
git commit -m "agrego stage de Deploy a QA"
git push
```

### 6.2 Verifico el Deployment
