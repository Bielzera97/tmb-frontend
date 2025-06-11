"use client";
import React, { useState, useEffect } from "react";
import styles from "./OrdersTable.module.css";
import * as signalR from "@microsoft/signalr";

type OrderStatus = "Pendente" | "Processando" | "Finalizado";

type Order = {
  id: string;
  cliente: string;
  produto: string;
  data: string;
  status: OrderStatus;
  valor: number;
};

type ApiOrder = {
  id: string;
  cliente: string;
  produto: string;
  data: string;
  status: number; // 0, 1, 2
  valor: number;
};

const statusMap: Record<number, OrderStatus> = {
  0: "Pendente",
  1: "Processando",
  2: "Finalizado",
};

const statusReverseMap: Record<OrderStatus, number> = {
  Pendente: 0,
  Processando: 1,
  Finalizado: 2,
};

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    cliente: "",
    produto: "",
    data: "",
    status: "" as OrderStatus | "",
    valor: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // NOVO

  // Buscar todos os pedidos
  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5297/orders");
    const data: ApiOrder[] = await res.json();
    setOrders(
      data.map((o) => ({
        id: o.id,
        cliente: o.cliente,
        produto: o.produto,
        data: o.data,
        status: statusMap[o.status],
        valor: typeof o.valor === "number" ? o.valor : 0,
      }))
    );
    setLoading(false);
  };

  // Buscar detalhes do pedido
  const fetchOrderById = async (id: string) => {
    setLoading(true);
    const res = await fetch(`http://localhost:5297/orders/${id}`);
    const o: ApiOrder = await res.json();
    setSelectedOrder({
      id: o.id,
      cliente: o.cliente,
      produto: o.produto,
      data: o.data,
      status: statusMap[o.status],
      valor: typeof o.valor === "number" ? o.valor : 0,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5297/hub/pedidos") // ajuste a URL se necessário
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Conectado ao SignalR");
    });

    // Quando receber notificação, atualiza os pedidos
    connection.on("PedidoAtualizado", () => {
      fetchOrders();
    });

    // Limpeza ao desmontar
    return () => {
      connection.stop();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRowClick = async (order: Order) => {
    await fetchOrderById(order.id);
    setForm({
      cliente: order.cliente,
      produto: order.produto,
      data: order.data.slice(0, 16), // Para input datetime-local
      status: order.status,
      valor: order.valor.toString(),
    });
    setShowModal(true);
    setEditMode(false);
  };

  const handleEdit = () => {
    if (!selectedOrder) return;
    setForm({
      cliente: selectedOrder.cliente,
      produto: selectedOrder.produto,
      data: selectedOrder.data.slice(0, 16),
      status: selectedOrder.status,
      valor: selectedOrder.valor.toString(),
    });
    setEditMode(true);
  };

  // Adicionar novo pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataISO = form.data ? new Date(form.data).toISOString() : "";

    if (editMode && selectedOrder) {
      // EDITAR PEDIDO
      await fetch(`http://localhost:5297/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id, // Adicione o id aqui!
          cliente: form.cliente,
          produto: form.produto,
          data: dataISO,
          status: statusReverseMap[form.status as OrderStatus],
          valor: parseFloat(form.valor),
        }),
      });
    } else {
      // NOVO PEDIDO
      await fetch("http://localhost:5297/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: form.cliente,
          produto: form.produto,
          data: dataISO,
          status: statusReverseMap[form.status as OrderStatus],
          valor: parseFloat(form.valor),
        }),
      });
    }
    setForm({ cliente: "", produto: "", data: "", status: "", valor: "" });
    setShowModal(false);
    setSelectedOrder(null);
    setEditMode(false);
    await fetchOrders();
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setEditMode(false);
    setForm({ cliente: "", produto: "", data: "", status: "", valor: "" });
  };

  // Deletar pedido
  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este pedido?")) return;
    setLoading(true);
    await fetch(`http://localhost:5297/orders/${id}`, {
      method: "DELETE",
    });
    setShowModal(false);
    setSelectedOrder(null);
    await fetchOrders();
    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.button}>
        <button
          className={styles.addBtn}
          onClick={() => {
            setShowModal(true);
            setSelectedOrder(null);
            setEditMode(true);
            setForm({ cliente: "", produto: "", data: "", status: "", valor: "" });
          }}
        >
          Novo Pedido
        </button>
      </div>

      {loading && <div style={{ color: "#2563eb", marginBottom: 16 }}>Carregando...</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Valor (R$)</th>
            <th>Status</th>
            <th>Data Criação</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => handleRowClick(order)}
            >
              <td>{order.cliente}</td>
              <td>{order.produto}</td>
              <td>{order.valor.toFixed(2)}</td>
              <td>
                <span
                  className={
                    styles.status +
                    " " +
                    (order.status === "Pendente"
                      ? styles.statusPendente
                      : order.status === "Processando"
                      ? styles.statusProcessando
                      : styles.statusFinalizado)
                  }
                >
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.data).toLocaleString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {selectedOrder && !editMode ? (
              <>
                <h2 className={styles.modalTitle}>Detalhes do Pedido</h2>
                <div className={styles.modalDetails}>
                  <p>
                    <strong>Produto:</strong> {selectedOrder.produto}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {selectedOrder.cliente}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(selectedOrder.data).toLocaleString("pt-BR")}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Valor:</strong> R$ {selectedOrder.valor.toFixed(2)}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedOrder.id}
                  </p>
                </div>
                <div className={styles.modalActions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(selectedOrder.id)}
                  >
                    Excluir
                  </button>
                  <button
                    className={styles.submitBtn}
                    onClick={handleEdit}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.closeBtn}
                    onClick={handleCloseModal}
                  >
                    Fechar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className={styles.modalTitle}>
                  {selectedOrder ? "Editar Pedido" : "Novo Pedido"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <input
                    name="produto"
                    type="text"
                    placeholder="Produto"
                    value={form.produto}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="cliente"
                    type="text"
                    placeholder="Cliente"
                    value={form.cliente}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="data"
                    type="datetime-local"
                    value={form.data}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Processando">Processando</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                  <input
                    name="valor"
                    type="number"
                    step="0.01"
                    placeholder="Valor (R$)"
                    value={form.valor}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                    >
                      {selectedOrder ? "Salvar" : "Adicionar"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;