import { pool } from "../../config/db.js";

export const searchRequests = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;
    const client = await pool.connect();
    const result = await client.query(
      `SELECT s.*, jsonb_build_object(
        'id', e.id,
        'nombre', e.nombre
      ) AS empleado from solicitud s INNER JOIN empleado e ON e.id = s.id_empleado 
        WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', $1::text, '%')) OR LOWER(s.codigo) LIKE LOWER(CONCAT('%', $1::text, '%')) 
        ORDER BY s.fecha_creacion DESC 
        LIMIT $2::numeric OFFSET ($3::numeric - 1) * $2::numeric`,
      [search, limit, page]
    );
    const total = await client.query("SELECT COUNT(*) AS total FROM solicitud");
    const hastNextPage = await client.query(
      "SELECT COUNT(*) AS total FROM solicitud OFFSET ($1::numeric * $2::numeric) + $2::numeric",
      [page, limit]
    );
    client.release();
    return res.status(200).json({
      docs: result.rows,
      total: total.rows[0].total,
      hastNextPage: hastNextPage.rows[0]?.total > 0,
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { codigo, descripcion, resumen, id_empleado } = req.body;
    const client = await pool.connect();
    const existsEmployee = await client.query(
      "SELECT id FROM empleado WHERE id = $1",
      [id_empleado]
    );
    if (!existsEmployee.rows[0])
      return res.status(404).json({ message: "El empleado no existe" });

    await client.query(
      "INSERT INTO solicitud (codigo, descripcion, resumen, id_empleado) VALUES($1, $2, $3, $4)",
      [codigo, descripcion, resumen, id_empleado]
    );
    client.release();
    return res.status(201).json({ message: "Solicitud creada" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const client = await pool.connect();
    const query = Object.keys(body)
      .map((k) => `${k} = '${body[k]}'`)
      .join(", ");

    await client.query(`UPDATE solicitud SET ${query} WHERE id = $1::numeric`, [
      id,
    ]);
    client.release();
    return res.status(200).json({ message: "Solicitud actualizada" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    await client.query("DELETE FROM solicitud WHERE id = $1", [id]);
    client.release();
    return res.status(200).json({ message: "Solicitud eliminada" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
