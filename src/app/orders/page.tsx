import styles from "./orders.module.css";
import OrdersTable from "../components/OrdersTable";

const OrderPage = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Página de Pedidos</h1>
      <p className={styles.subtitle}>
        CRUD Completo de Pedidos com Next.js, TypeScript, Tailwind CSS, .NET 8, Entity Framework Core e Posgres
      </p>
      <div className={styles.ordersTableWrapper}>
        <OrdersTable />
      </div>
    </main>
  );
};

export default OrderPage;