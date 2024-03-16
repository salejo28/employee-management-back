CREATE DATABASE employee_management;

USE employee_management;

CREATE TABLE empleado(
  id SERIAL NOT NULL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  fecha_ingreso DATE,
  salario NUMERIC,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitud(
  id SERIAL NOT NULL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL,
  descripcion VARCHAR(50) NOT NULL,
  resumen VARCHAR(50) NOT NULL,
  id_empleado INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_id_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id)
);

/* Function */
CREATE OR REPLACE FUNCTION set_updatedAt() RETURNS trigger AS
$set_updatedAt$
BEGIN
    IF NEW."fecha_actualizacion" = OLD."fecha_actualizacion" THEN
        NEW."fecha_actualizacion" = NOW();
    END IF;
    RETURN NEW;
END;
$set_updatedAt$ LANGUAGE plpgsql;

CREATE TRIGGER table_update
BEFORE UPDATE ON "empleado"
FOR EACH ROW EXECUTE PROCEDURE set_updatedAt();

CREATE TRIGGER table_update
BEFORE UPDATE ON "solicitud"
FOR EACH ROW EXECUTE PROCEDURE set_updatedAt();

/* Describe tables */
\d empleado;

\d solicitud;