import { Button, Paper } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import orderApi from "../modules/Order/apis/ordedrApi";
import { Order } from "../modules/Order/models";
export default function ManageOrderPage() {
  const [orderData, setOrderData] = useState<Order[]>([]);

  const columns: GridColDef[] = [
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 150,
      valueFormatter: (params) => {
        const orderDate = new Date(params.value);
        const formattedDate = orderDate.toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
        return formattedDate;
      },
    },
    { field: "shipAddress", headerName: "Shipping Address", width: 150 },
    { field: "shipPhone", headerName: "Shipping Phone", width: 150 },
    { field: "shippedBy", headerName: "Shipped By", width: 150 },
    { field: "shipDate", headerName: "Ship Date", width: 150 },
    { field: "paymentDate", headerName: "Payment Date", width: 150 },
    { field: "totalAmount", headerName: "Total Amount", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params: GridCellParams) => {
        const handleCancel = () => {
          const orderId = params.row.id as number;
          orderApi
            .cancelOrder(orderId)
            .then((response) => {
              console.log("Order canceled:", response);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setOrderData((prevOrderData: any) => {
                const updatedOrderData = prevOrderData.map((order: Order) => {
                  if (order.id == orderId) {
                    return { ...order, status: "Cancelled" };
                  }
                  return order;
                });
                return updatedOrderData;
              });
            })
            .catch((error) => {
              console.error("Error canceling order:", error);
            });
          console.log(`Cancel order with ID: ${orderId}`);
        };
        const isCancelled = params.row.status === "Cancelled";
        return (
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            sx={{ height: "25px" }}
            disabled={isCancelled}
          >
            Cancel
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    orderApi
      .customerFetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        console.log(response.data);
        const data = response.data;
        const orders = data.map((order: Order) => ({
          id: `${order.id}`,
          orderDate: `${order.orderDate}`,
          shipAddress: `${order.shipAddress}`,
          shipPhone: `${order.shipPhone}`,
          shippedBy: `${order.shippedBy}`,
          shipDate: `${order.shipDate}`,
          paymentDate: `${order.paymentDate}`,
          totalAmount: `${order.totalAmount}`,
          status: `${order.status}`,
        }));
        setOrderData(orders);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  }, []);
  return (
    <Paper sx={{ m: 2, borderRadius: 3 }}>
      <DataGrid
        rows={orderData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Paper>
  );
}
