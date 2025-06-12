import styles from "./orders.module.css";
import OrdersTable from "../components/OrdersTable";

const OrderPage = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Página de Pedidos</h1>
      <p className={styles.subtitle}>
        CRUD Completo de Pedidos com <span className="font-extrabold">Next.js </span>, <span className="font-extrabold">TypeScript</span>, <span className="font-extrabold">Tailwind CSS</span>, <span className="font-extrabold">.NET 8</span>, <span className="font-extrabold">Entity Framework Core</span> e <span className="font-extrabold">Postgres</span>
      </p>
      <div className={styles.ordersTableWrapper}>
        <OrdersTable />
      </div>
    </main>
  );
};

export default OrderPage;