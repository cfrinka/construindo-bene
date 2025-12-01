"use client";

import { useEffect, useState } from "react";
import { subscribeAllOrders, updateOrderStatus, isFirebaseEnabled } from "@/lib/firebase";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  cover?: string;
};

type Order = {
  id: string;
  orderNumber: number;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shipping: {
    name: string;
    price: number;
    days: number;
  };
  shippingAddress?: any;
  createdAt: string;
  updatedAt: string;
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const enabled = isFirebaseEnabled();
  const { show } = useToast();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    setLoading(true);
    subscribeAllOrders((orders) => {
      setOrders(orders as Order[]);
      setLoading(false);
      setError("");
    }).then((unsub) => {
      unsubscribe = unsub;
    }).catch((e: any) => {
      setError(e?.message || "Erro ao carregar pedidos");
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.ok) {
        // Real-time subscription will automatically update the orders
        show({ description: "Status atualizado com sucesso", variant: "success" });
      } else {
        show({ description: "Erro ao atualizar status", variant: "error" });
      }
    } catch (e: any) {
      show({ description: e?.message || "Erro ao atualizar status", variant: "error" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePrintLabel = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const labelHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiqueta de Envio - Pedido #${order.orderNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .label {
              border: 2px solid #000;
              padding: 20px;
              margin-bottom: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-title {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            .address {
              font-size: 16px;
              line-height: 1.6;
            }
            .order-info {
              background: #f5f5f5;
              padding: 10px;
              margin-bottom: 15px;
            }
            .items {
              margin-top: 15px;
            }
            .item {
              padding: 5px 0;
              border-bottom: 1px solid #ddd;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">
              <h1>ETIQUETA DE ENVIO</h1>
              <p>Pedido #${order.orderNumber}</p>
            </div>

            <div class="order-info">
              <strong>Data do Pedido:</strong> ${new Date(order.createdAt).toLocaleDateString('pt-BR')}<br>
              <strong>Método de Envio:</strong> ${order.shipping.name}<br>
              <strong>Prazo:</strong> ${order.shipping.days} ${order.shipping.days === 1 ? 'dia útil' : 'dias úteis'}
            </div>

            <div class="section">
              <div class="section-title">Destinatário:</div>
              <div class="address">
                <strong>${order.shippingAddress?.name || 'N/A'}</strong><br>
                ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.number || ''}<br>
                ${order.shippingAddress?.complement ? order.shippingAddress.complement + '<br>' : ''}
                ${order.shippingAddress?.neighborhood || ''}<br>
                ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.state || ''}<br>
                CEP: ${order.shippingAddress?.zipCode || ''}<br>
                Tel: ${order.shippingAddress?.phone || ''}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Remetente:</div>
              <div class="address">
                <strong>Benê Brasil</strong><br>
                Rua São Sebastião, 64<br>
                Jardinópolis - SP<br>
                Centro<br>
                CEP: 14680-057
              </div>
            </div>

            <div class="items">
              <div class="section-title">Itens do Pedido:</div>
              ${order.items.map(item => `
                <div class="item">
                  ${item.quantity}x ${item.title}
                  ${item.size ? `- Tamanho: ${item.size}` : ''}
                  ${item.color ? `- Cor: ${item.color}` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-bottom: 20px;">
            Imprimir Etiqueta
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(labelHTML);
    printWindow.document.close();
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      processing: "Em processamento",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-neutral-100 text-neutral-800";
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  if (!enabled) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Firebase não está habilitado.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === "all" ? "primary" : "outline"}
          onClick={() => setFilterStatus("all")}
          className="text-sm"
        >
          Todos ({orders.length})
        </Button>
        <Button
          variant={filterStatus === "pending" ? "primary" : "outline"}
          onClick={() => setFilterStatus("pending")}
          className="text-sm"
        >
          Pendentes ({orders.filter(o => o.status === "pending").length})
        </Button>
        <Button
          variant={filterStatus === "processing" ? "primary" : "outline"}
          onClick={() => setFilterStatus("processing")}
          className="text-sm"
        >
          Em processamento ({orders.filter(o => o.status === "processing").length})
        </Button>
        <Button
          variant={filterStatus === "shipped" ? "primary" : "outline"}
          onClick={() => setFilterStatus("shipped")}
          className="text-sm"
        >
          Enviados ({orders.filter(o => o.status === "shipped").length})
        </Button>
        <Button
          variant={filterStatus === "delivered" ? "primary" : "outline"}
          onClick={() => setFilterStatus("delivered")}
          className="text-sm"
        >
          Entregues ({orders.filter(o => o.status === "delivered").length})
        </Button>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border border-neutral-200">
              <CardBody className="p-6">
                {/* Order header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-200">
                  <div>
                    <h3 className="font-semibold text-lg">Pedido #{order.orderNumber}</h3>
                    <p className="text-sm text-neutral-600">
                      {new Date(order.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">ID: {order.userId}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      {item.cover && (
                        <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-100 rounded">
                          <Image
                            src={item.cover}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-neutral-600">
                          {item.size && `Tamanho: ${item.size}`}
                          {item.size && item.color && " • "}
                          {item.color && `Cor: ${item.color}`}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Quantidade: {item.quantity} • R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="border-t border-neutral-200 pt-4 mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>R$ {(order.total - order.shipping.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600">
                      Frete ({order.shipping.name})
                    </span>
                    <span>R$ {order.shipping.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="border-t border-neutral-200 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Endereço de Entrega:</p>
                      <Button
                        variant="outline"
                        onClick={() => handlePrintLabel(order)}
                        className="text-xs"
                      >
                        🖨️ Imprimir Etiqueta
                      </Button>
                    </div>
                    <div className="bg-neutral-50 rounded-md p-3 text-sm space-y-1">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p className="text-neutral-700">
                        {order.shippingAddress.street}, {order.shippingAddress.number}
                        {order.shippingAddress.complement && ` - ${order.shippingAddress.complement}`}
                      </p>
                      <p className="text-neutral-700">
                        {order.shippingAddress.neighborhood}
                      </p>
                      <p className="text-neutral-700">
                        {order.shippingAddress.city} - {order.shippingAddress.state}
                      </p>
                      <p className="text-neutral-700">
                        CEP: {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-neutral-700">
                        Tel: {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status actions */}
                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-sm font-medium mb-2">Alterar status:</p>
                  <div className="flex gap-2 flex-wrap">
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <Button
                        key={status}
                        variant={order.status === status ? "primary" : "outline"}
                        onClick={() => handleStatusChange(order.id, status)}
                        disabled={updatingStatus === order.id || order.status === status}
                        className="text-sm"
                      >
                        {getStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
