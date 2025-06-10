"use client";
import React, { useState, useEffect } from "react";

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
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Adicionar novo pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Converte data para ISO se vier do input datetime-local
    const dataISO = form.data ? new Date(form.data).toISOString() : "";

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
    setForm({ cliente: "", produto: "", data: "", status: "", valor: "" });
    setShowModal(false);
    await fetchOrders();
    setLoading(false);
  };

  const handleRowClick = async (order: Order) => {
    await fetchOrderById(order.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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
    <div className="overflow-x-auto w-full mt-8">
      <button
        className="flex justify-end mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => {
          setShowModal(true);
          setSelectedOrder(null);
        }}
      >
        Novo Pedido
      </button>

      {loading && <div className="mb-4 text-blue-600">Carregando...</div>}

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Cliente</th>
            <th className="px-4 py-2 text-left">Produto</th>
            <th className="px-4 py-2 text-left">Valor (R$)</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Data Criação</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-t cursor-pointer hover:bg-blue-50"
              onClick={() => handleRowClick(order)}
            >
              <td className="px-4 py-2">{order.cliente}</td>
              <td className="px-4 py-2">{order.produto}</td>
              <td className="px-4 py-2">{order.valor.toFixed(2)}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">
                {new Date(order.data).toLocaleString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            {selectedOrder ? (
              <>
                <h2 className="text-xl font-bold mb-4">Detalhes do Pedido</h2>
                <div className="mb-4">
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
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(selectedOrder.id)}
                  >
                    Excluir
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleCloseModal}
                  >
                    Fechar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Novo Pedido</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="produto"
                    type="text"
                    placeholder="Produto"
                    value={form.produto}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    name="cliente"
                    type="text"
                    placeholder="Cliente"
                    value={form.cliente}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    name="data"
                    type="datetime-local"
                    value={form.data}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
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
                    className="w-full border px-3 py-2 rounded"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Adicionar
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