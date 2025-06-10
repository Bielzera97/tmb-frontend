import OrdersTable from "../components/OrdersTable";

const OrderPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Orders Page</h1>
      <p className="mt-4 text-lg">This is the orders page of the TMB-Challenge application.</p>
      <OrdersTable/>
    </main>
  );
}

export default OrderPage;