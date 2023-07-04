import { Box, Button, Paper } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import orderApi from "../modules/Order/apis/ordedrApi";
import { Order } from "../modules/Order/models";

export default function ManageOrderPage() {
  const [orderData, setOrderData] = useState<Order[]>([]);

  const columns: GridColDef[] = [
    { field: "customerName", headerName: "Name", width: 100 },
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
    { field: "shipPhone", headerName: "Phone", width: 120 },
    { field: "shippedBy", headerName: "Shipped By", width: 100 },
    { field: "shipDate", headerName: "Ship Date", width: 100 },
    { field: "paymentDate", headerName: "Payment Date", width: 100 },
    { field: "totalAmount", headerName: "Total Amount", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params: GridCellParams) => {
        const status = params.row.status;
        return (
          <>
            {status === "Cancelled" && (
              <Box
                sx={{
                  width: '80px',
                  borderRadius: "8px",
                  backgroundColor: "#FF5733",
                  color: "#fff",
                }}
              >
                Cancelled
              </Box>
            )}
            {status === "Processing" && (
              <Box
                sx={{
                  width: '80px',
                  borderRadius: "8px",
                  backgroundColor: "#FFC300 ",
                  color: "#fff",
                }}
              >
                Processing
              </Box>
            )}
            {status === "Completed" && (
              <Box
                sx={{
                  width: '80px',
                  borderRadius: "8px",
                  backgroundColor: "#009E60",
                  color: "#fff",
                }}
              >
                Completed
              </Box>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params: GridCellParams) => {
        const handleCancel = () => {
          const orderId = params.row.id as number;
          orderApi
            .cancelOrder(orderId)
            .then(() => {
              updateOrderStatus(orderId, "Cancelled");
            })
            .catch((error) => {
              console.error("Error canceling order:", error);
            });
        };

        const handleConfirm = () => {
          const orderId = params.row.id as number;
          orderApi
            .staffConfirmOrder(orderId)
            .then(() => {
              updateOrderStatus(orderId, "Processing");
            })
            .catch((error) => {
              console.error("Error confirming order:", error);
            });
        };
        const handleDone = () => {
          const orderId = params.row.id as number;
          orderApi
            .staffDoneOrder(orderId)
            .then(() => {
              updateOrderStatus(orderId, "Completed");
            })
            .catch((error) => {
              console.error("Error marking order as done:", error);
            });
        };

        const isWaiting = params.row.status === "Waiting";
        const isProcessing = params.row.status === "Processing";
        const isCancelled = params.row.status === "Cancelled";
        const isCompleted = params.row.status === "Completed";
        if (isWaiting) {
          return (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancel}
                sx={{ height: "25px", mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                sx={{ height: "25px" }}
              >
                Confirm
              </Button>
            </>
          );
        }

        if (isProcessing) {
          return (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancel}
                sx={{ height: "25px", mr: 1 }}
                disabled={isCancelled}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDone}
                sx={{ height: "25px" }}
              >
                Done
              </Button>
            </>
          );
        }

        if (isCompleted) {
          return <></>;
        }

        // Default action buttons for other statuses
        return <></>;
      },
    },
  ];

  const updateOrderStatus = (orderId: number, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOrderData((prevOrderData: any) => {
      return prevOrderData.map((order: Order) => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      });
    });
  };

  useEffect(() => {
    orderApi
      .staffFetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        console.log(response.data);
        const data = response.data;
        const orders = data.map((order: Order) => ({
          id: `${order.id}`,
          customerName: `${order.customer.name}`,
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
