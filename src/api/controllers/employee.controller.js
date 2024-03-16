import { pool } from "../../config/db.js";

export const searchEmployee = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM empleado WHERE LOWER(nombre) LIKE LOWER(CONCAT('%', $1::text, '%')) ORDER BY nombre ASC LIMIT $2::numeric OFFSET ($3::numeric - 1) * $2::numeric ",
      [search, limit, page]
    );
    const total = await client.query("SELECT COUNT(*) AS total FROM empleado");
    const hastNextPage = await client.query(
      "SELECT COUNT(*) AS total FROM empleado OFFSET ($1::numeric * $2::numeric) + $2::numeric",
      [page, limit]
    );
    client.release();
    return res.status(200).json({
      docs: result.rows,
      total: total.rows[0].total,
      hastNextPage: hastNextPage.rows[0]?.total > 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { nombre, fecha_ingreso, salario } = req.body;
    const client = await pool.connect();
    await client.query(
      "INSERT INTO empleado (nombre, fecha_ingreso, salario) VALUES ($1, $2, $3)",
      [nombre, fecha_ingreso, salario]
    );
    client.release();
    return res
      .status(201)
      .json({ message: "Empleado creado satisfactoriamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const client = await pool.connect();
    const query = Object.keys(body)
      .map((k) => `${k} = '${body[k]}'`)
      .join(", ");
    await client.query(`UPDATE empleado SET ${query} WHERE id = $1::numeric`, [
      +id,
    ]);
    client.release();
    return res
      .status(200)
      .json({ message: "Empleado actualizado satisfactoriamente" });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    await client.query("DELETE FROM solicitud WHERE id_empleado = $1", [id])
    await client.query("DELETE FROM empleado WHERE id = $1", [+id]);
    client.release();
    return res.status(200).json({ message: "Empleado eliminado" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
