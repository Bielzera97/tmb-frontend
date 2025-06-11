import styles from "./orders.module.css";
import OrdersTable from "../components/OrdersTable";

const OrderPage = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Orders Page</h1>
      <p className={styles.subtitle}>
        This is the orders page of the TMB-Challenge application.
      </p>
      <div className={styles.ordersTableWrapper}>
        <OrdersTable />
      </div>
    </main>
  );
};

export default OrderPage;