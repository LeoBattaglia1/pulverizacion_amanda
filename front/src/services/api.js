import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// CLIENTES
export const getClientes = () => api.get("/clientes");
export const createCliente = (data) => api.post("/clientes", data);
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);

// CAMPOS
export const getCampos = () => api.get("/campos");
export const getCamposByCliente = (clienteId) =>
  api.get(`/campos?cliente_id=${clienteId}`);
export const createCampo = (data) => api.post("/campos", data);
export const updateCampo = (id, data) => api.put(`/campos/${id}`, data);
export const deleteCampo = (id) => api.delete(`/campos/${id}`);

// LOTES
export const getLotes = () => api.get("/lotes");
export const getLotesByCampo = (campoId) =>
  api.get(`/lotes?campo_id=${campoId}`);
export const createLote = (data) => api.post("/lotes", data);

// TRABAJOS
export const getTrabajos = () => api.get("/trabajos");
export const createTrabajo = (data) => api.post("/trabajos", data);

// PAGOS CLIENTES
export const getPagosClientes = () => api.get("/pagos-clientes");
export const createPagoCliente = (data) => api.post("/pagos-clientes", data);

// MÁQUINAS
export const getMaquinas = () => api.get("/maquinas");

// EMPLEADOS
export const getEmpleados = () => api.get("/empleados");

// EMPLEADOS - MÁQUINAS (Tabla intermedia)
export const getEmpleadosMaquinas = () => api.get("/empleados-maquinas");
export const assignEmpleadoMaquina = (data) =>
  api.post("/empleados-maquinas", data);
export const deleteEmpleadoMaquina = (data) =>
  api.delete("/empleados-maquinas", { data });

// INSUMOS / STOCK
export const getInsumos = () => api.get("/insumos");
export const createInsumo = (data) => api.post("/insumos", data);
export const updateInsumo = (id, data) => api.put(`/insumos/${id}`, data);

// INGRESOS DE INSUMOS
export const createIngresoInsumo = (data) =>
  api.post("/insumos/ingresos", data);

// RETIROS DE INSUMOS
export const createRetiroInsumo = (data) => api.post("/insumos/retiros", data);

export default api;
