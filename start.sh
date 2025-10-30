#!/bin/bash

# Script de inicio rápido para TP05 Release Pipelines
# Este script inicializa y ejecuta toda la aplicación con un solo comando

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== TP05 Release Pipelines - Inicio Rápido ===${NC}\n"

# Verificar si existe .env, si no, copiar desde .env.example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creando archivo .env desde .env.example...${NC}"
    cp .env.example .env
fi

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker no está instalado. Por favor, instale Docker para continuar.${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Docker Compose no está instalado. Por favor, instale Docker Compose para continuar.${NC}"
    exit 1
fi

# Detener contenedores existentes si los hay
echo -e "${BLUE}Deteniendo contenedores existentes...${NC}"
docker compose down 2>/dev/null || true

# Construir y levantar los servicios
echo -e "${BLUE}Construyendo imágenes y levantando servicios...${NC}"
docker compose up --build -d

# Esperar a que los servicios estén listos
echo -e "${BLUE}Esperando a que los servicios estén listos...${NC}"
sleep 5

# Verificar estado de los servicios
echo -e "\n${GREEN}Estado de los servicios:${NC}"
docker compose ps

echo -e "\n${GREEN}✓ Aplicación iniciada exitosamente!${NC}\n"
echo -e "Accede a la aplicación en:"
echo -e "  ${BLUE}Frontend:${NC} http://localhost:5173"
echo -e "  ${BLUE}Backend:${NC}  http://localhost:4000"
echo -e "  ${BLUE}Database:${NC} PostgreSQL en localhost:5432\n"
echo -e "Para ver los logs: ${YELLOW}docker compose logs -f${NC}"
echo -e "Para detener: ${YELLOW}docker compose down${NC}\n"
