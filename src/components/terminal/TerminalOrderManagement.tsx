
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Target, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react";

interface TradingOrder {
  id: string;
  symbol: string;
  order_type: string;
  side: string;
  quantity: number;
  price?: number;
  stop_price?: number;
  status: string;
  filled_quantity: number;
  filled_price?: number;
  created_at: string;
  filled_at?: string;
}

interface TerminalOrderManagementProps {
  selectedSymbol: string;
}

export const TerminalOrderManagement = ({ selectedSymbol }: TerminalOrderManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<TradingOrder[]>([]);
  const [accountBalance, setAccountBalance] = useState(100000);
  const [loading, setLoading] = useState(false);
  
  // Order form state
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchAccountBalance();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('trading_orders')
        .select(`
          *,
          trading_accounts!inner(user_id)
        `)
        .eq('trading_accounts.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchAccountBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Create default account if doesn't exist
        const { data: newAccount, error: createError } = await supabase
          .from('trading_accounts')
          .insert({
            user_id: user.id,
            account_name: 'Main Trading Account',
            initial_balance: 100000,
            current_balance: 100000
          })
          .select()
          .single();

        if (createError) throw createError;
        setAccountBalance(newAccount.current_balance);
      } else {
        setAccountBalance(data.current_balance);
      }
    } catch (error) {
      console.error('Error fetching account balance:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !quantity) {
      toast({
        title: "Invalid Order",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Get user's trading account
      const { data: account, error: accountError } = await supabase
        .from('trading_accounts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (accountError) throw accountError;

      // Create order
      const orderData = {
        account_id: account.id,
        symbol: selectedSymbol,
        order_type: orderType,
        side,
        quantity: parseFloat(quantity),
        price: orderType !== 'market' ? parseFloat(price) : null,
        stop_price: orderType === 'stop' || orderType === 'stop_limit' ? parseFloat(stopPrice) : null,
        status: 'pending'
      };

      const { data: newOrder, error } = await supabase
        .from('trading_orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Simulate order execution for demo (in real app, this would be handled by a background process)
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('trading_orders')
          .update({
            status: 'filled',
            filled_quantity: parseFloat(quantity),
            filled_price: orderType === 'market' ? 150.00 + Math.random() * 20 : parseFloat(price),
            filled_at: new Date().toISOString()
          })
          .eq('id', newOrder.id);

        if (!updateError) {
          fetchOrders();
          toast({
            title: "Order Executed",
            description: `${side.toUpperCase()} order for ${quantity} shares of ${selectedSymbol} has been filled`,
            variant: "default"
          });
        }
      }, 2000);

      // Clear form
      setQuantity("");
      setPrice("");
      setStopPrice("");
      
      fetchOrders();
      
      toast({
        title: "Order Placed",
        description: `${side.toUpperCase()} order for ${quantity} shares of ${selectedSymbol}`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('trading_orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;
      
      fetchOrders();
      toast({
        title: "Order Cancelled",
        description: "Order has been successfully cancelled",
        variant: "default"
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Cancel Failed",
        description: "Failed to cancel order",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
        return 'border-green-600 text-green-400';
      case 'cancelled':
      case 'rejected':
        return 'border-red-600 text-red-400';
      default:
        return 'border-yellow-600 text-yellow-400';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Order entry form */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
            <Target className="w-5 h-5" />
            ORDER ENTRY - {selectedSymbol}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Account balance */}
          <div className="p-3 bg-black border border-green-600 rounded">
            <div className="flex items-center justify-between">
              <span className="text-green-400">BUYING POWER:</span>
              <span className="text-white font-bold">
                ${accountBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Order side */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={side === "buy" ? "default" : "outline"}
              onClick={() => setSide("buy")}
              className={side === "buy" ? "bg-green-700 hover:bg-green-600" : "border-green-600 text-green-400"}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              BUY
            </Button>
            <Button
              variant={side === "sell" ? "default" : "outline"}
              onClick={() => setSide("sell")}
              className={side === "sell" ? "bg-red-700 hover:bg-red-600" : "border-red-600 text-red-400"}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              SELL
            </Button>
          </div>

          {/* Order type */}
          <div>
            <Label className="text-green-400">ORDER TYPE</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="bg-black border-green-600 text-green-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-800">
                <SelectItem value="market">MARKET</SelectItem>
                <SelectItem value="limit">LIMIT</SelectItem>
                <SelectItem value="stop">STOP</SelectItem>
                <SelectItem value="stop_limit">STOP LIMIT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Label className="text-green-400">QUANTITY</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Number of shares"
              className="bg-black border-green-600 text-green-400"
            />
          </div>

          {/* Price (for limit orders) */}
          {(orderType === "limit" || orderType === "stop_limit") && (
            <div>
              <Label className="text-green-400">LIMIT PRICE</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per share"
                className="bg-black border-green-600 text-green-400"
              />
            </div>
          )}

          {/* Stop price */}
          {(orderType === "stop" || orderType === "stop_limit") && (
            <div>
              <Label className="text-green-400">STOP PRICE</Label>
              <Input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="Stop trigger price"
                className="bg-black border-green-600 text-green-400"
              />
            </div>
          )}

          {/* Place order button */}
          <Button
            onClick={handlePlaceOrder}
            disabled={loading || !quantity}
            className={`w-full ${
              side === "buy" 
                ? "bg-green-700 hover:bg-green-600" 
                : "bg-red-700 hover:bg-red-600"
            }`}
          >
            {loading ? "PLACING..." : `PLACE ${side.toUpperCase()} ORDER`}
          </Button>

          {/* Order preview */}
          {quantity && (
            <div className="p-3 bg-black border border-green-600 rounded">
              <h4 className="text-green-400 font-semibold mb-2">ORDER PREVIEW</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-400">Action:</span>
                  <span className="text-white">{side.toUpperCase()} {quantity} {selectedSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Type:</span>
                  <span className="text-white">{orderType.toUpperCase()}</span>
                </div>
                {orderType !== "market" && price && (
                  <div className="flex justify-between">
                    <span className="text-green-400">Price:</span>
                    <span className="text-white">${price}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order book / Active orders */}
      <Card className="col-span-2 bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono">
            ORDER MANAGEMENT & EXECUTION
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Active orders */}
            <div>
              <h4 className="text-green-400 font-semibold mb-2">ACTIVE ORDERS</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {orders.filter(order => order.status === 'pending').map((order) => (
                  <div 
                    key={order.id}
                    className="p-3 bg-black border border-yellow-600 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="text-white font-semibold">
                          {order.side.toUpperCase()} {order.quantity} {order.symbol}
                        </div>
                        <div className="text-xs text-green-400">
                          {order.order_type.toUpperCase()} 
                          {order.price && ` @ $${order.price}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900"
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ))}
                {orders.filter(order => order.status === 'pending').length === 0 && (
                  <div className="text-center text-green-600 py-4">
                    NO ACTIVE ORDERS
                  </div>
                )}
              </div>
            </div>

            {/* Recent executions */}
            <div>
              <h4 className="text-green-400 font-semibold mb-2">RECENT EXECUTIONS</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orders.filter(order => order.status === 'filled').slice(0, 5).map((order) => (
                  <div 
                    key={order.id}
                    className="p-2 bg-black border border-green-600 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="text-white text-sm">
                          {order.side.toUpperCase()} {order.filled_quantity} {order.symbol}
                        </div>
                        <div className="text-xs text-green-400">
                          @ ${order.filled_price?.toFixed(2)} - {new Date(order.filled_at!).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      FILLED
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
