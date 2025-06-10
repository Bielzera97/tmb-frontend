"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type OrderStatus = "Pendente" | "Processando" | "Finalizado";

type Order = {
  id: string; // GUID
  product: string;
  customer: string;
  date: string; // ISO string
  status: OrderStatus;
  total: number; // decimal
};

const initialOrders: Order[] = [
  {
    id: uuidv4(),
    product: "Notebook",
    customer: "João Silva",
    date: "2025-06-10T10:00:00",
    status: "Pendente",
    total: 150.5,
  },
  {
    id: uuidv4(),
    product: "Mouse",
    customer: "Maria Souza",
    date: "2025-06-09T14:30:00",
    status: "Processando",
    total: 320.0,
  },
  {
    id: uuidv4(),
    product: "Teclado",
    customer: "Carlos Lima",
    date: "2025-06-08T09:15:00",
    status: "Finalizado",
    total: 89.99,
  },
];

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    product: "",
    customer: "",
    date: "",
    status: "" as OrderStatus | "",
    total: "",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrders([
      ...orders,
      {
        id: uuidv4(),
        product: form.product,
        customer: form.customer,
        date: form.date,
        status: form.status as OrderStatus,
        total: parseFloat(form.total),
      },
    ]);
    setForm({ product: "", customer: "", date: "", status: "", total: "" });
    setShowModal(false);
  };

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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
              <td className="px-4 py-2">{order.customer}</td>
              <td className="px-4 py-2">{order.product}</td>
              <td className="px-4 py-2">{order.total.toFixed(2)}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">
                {new Date(order.date).toLocaleString("pt-BR")}
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
                    <strong>Produto:</strong> {selectedOrder.product}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {selectedOrder.customer}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(selectedOrder.date).toLocaleString("pt-BR")}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Valor:</strong> R$ {selectedOrder.total.toFixed(2)}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedOrder.id}
                  </p>
                </div>
                <div className="flex justify-end">
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
                    name="product"
                    type="text"
                    placeholder="Produto"
                    value={form.product}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    name="customer"
                    type="text"
                    placeholder="Cliente"
                    value={form.customer}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    name="date"
                    type="datetime-local"
                    value={form.date}
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
                    name="total"
                    type="number"
                    step="0.01"
                    placeholder="Valor (R$)"
                    value={form.total}
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