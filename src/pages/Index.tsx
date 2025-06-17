
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MessageCircle, Star, Minus, Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  reviews: Review[];
}

interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  email: string;
  password: string;
  name: string;
}

const Index = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [hasSpunWheel, setHasSpunWheel] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([
    { text: "Olá! Sou seu assistente virtual. Como posso ajudar você a encontrar o produto perfeito?", sender: 'bot' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeResult, setPrizeResult] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: "Mouse Gamer RGB",
      description: "Mouse gamer com iluminação RGB e precisão profissional",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
      reviews: [
        { user: "João Silva", rating: 5, comment: "Produto excelente! Super preciso para jogos." },
        { user: "Maria Santos", rating: 4, comment: "Chegou rápido e funcionando perfeitamente." },
        { user: "Pedro Costa", rating: 5, comment: "Melhor mouse que já tive, recomendo!" }
      ]
    },
    {
      id: 2,
      name: "Teclado Mecânico",
      description: "Teclado mecânico com switches Cherry MX e backlight",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
      reviews: [
        { user: "Ana Lima", rating: 5, comment: "Switches muito responsivos, adorei!" },
        { user: "Carlos Oliveira", rating: 4, comment: "Qualidade excelente, vale cada centavo." },
        { user: "Lucia Ferreira", rating: 5, comment: "Perfeito para programação e jogos." }
      ]
    },
    {
      id: 3,
      name: "Headset Gamer 7.1",
      description: "Headset com som surround 7.1 e microfone noise cancelling",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=200&fit=crop",
      reviews: [
        { user: "Rafael Souza", rating: 5, comment: "Som incrível, sinto como se estivesse no jogo!" },
        { user: "Fernanda Alves", rating: 4, comment: "Confortável para longas sessões de jogo." },
        { user: "Bruno Machado", rating: 5, comment: "Microfone muito claro, perfeito para streams." }
      ]
    },
    {
      id: 4,
      name: "Monitor 24' Full HD",
      description: "Monitor LED 24 polegadas com taxa de atualização 144Hz",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop",
      reviews: [
        { user: "Thiago Rocha", rating: 5, comment: "Cores vibrantes e zero input lag!" },
        { user: "Camila Nunes", rating: 4, comment: "Excelente para trabalho e entretenimento." },
        { user: "Diego Cardoso", rating: 5, comment: "144Hz faz toda a diferença nos jogos." }
      ]
    },
    {
      id: 5,
      name: "Caixa de Som Bluetooth",
      description: "Caixa de som portátil com alta qualidade e graves potentes",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
      reviews: [
        { user: "Juliana Pereira", rating: 5, comment: "Som muito limpo e graves excelentes!" },
        { user: "Roberto Silva", rating: 4, comment: "Bateria dura bastante, muito prática." },
        { user: "Patricia Gomes", rating: 5, comment: "Design bonito e som de qualidade." }
      ]
    },
    {
      id: 6,
      name: "Webcam Full HD",
      description: "Webcam com resolução Full HD e microfone integrado",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1587826080692-b5b8bec6ff7d?w=300&h=200&fit=crop",
      reviews: [
        { user: "Marcos Antonio", rating: 4, comment: "Imagem muito nítida para videochamadas." },
        { user: "Carla Mendes", rating: 5, comment: "Fácil de instalar e usar, recomendo." },
        { user: "André Ribeiro", rating: 4, comment: "Boa qualidade pelo preço, satisfeito." }
      ]
    }
  ];

  const chatResponses: { [key: string]: string } = {
    "mouse": "Recomendo o Mouse Gamer RGB! Ele tem precisão profissional e iluminação linda. Perfeito para jogos e trabalho.",
    "teclado": "O Teclado Mecânico é incrível! Os switches Cherry MX proporcionam uma digitação muito satisfatória.",
    "headset": "O Headset Gamer 7.1 é excelente! Som surround incrível e microfone com cancelamento de ruído.",
    "monitor": "O Monitor 24' Full HD com 144Hz é perfeito para jogos! Taxa de atualização alta elimina o lag.",
    "caixa": "A Caixa de Som Bluetooth tem graves potentes e é super portátil. Ideal para festas e viagens!",
    "webcam": "A Webcam Full HD é perfeita para home office e streams. Imagem nítida e microfone integrado.",
    "melhor": "Depende do seu uso! Para jogos: Mouse + Teclado + Headset. Para trabalho: Monitor + Webcam.",
    "preço": "Temos produtos para todos os orçamentos! O mais barato é a Webcam por R$ 89,99.",
    "desconto": "Que sorte! Se você girou a roleta, pode ter ganhado desconto. Todos os produtos têm ótimo custo-benefício!",
    "entrega": "Entregamos para todo o Brasil! Frete grátis pode ser conquistado na roleta de prêmios.",
    "default": "Posso ajudar você a escolher entre Mouse, Teclado, Headset, Monitor, Caixa de Som ou Webcam. Qual categoria te interessa?"
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('techshop_user');
    const wheelData = localStorage.getItem('techshop_wheel');
    const cartData = localStorage.getItem('techshop_cart');
    const discountData = localStorage.getItem('techshop_discount');
    const shippingData = localStorage.getItem('techshop_shipping');
    
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    if (wheelData) {
      setHasSpunWheel(JSON.parse(wheelData));
    }
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
    if (discountData) {
      setAppliedDiscount(JSON.parse(discountData));
    }
    if (shippingData) {
      setFreeShipping(JSON.parse(shippingData));
    }
  }, []);

  // Show wheel modal for logged in users who haven't spun
  useEffect(() => {
    if (currentUser && !hasSpunWheel) {
      setTimeout(() => {
        setShowWheelModal(true);
      }, 1000);
    }
  }, [currentUser, hasSpunWheel]);

  // Save data to localStorage
  const saveData = () => {
    if (currentUser) {
      localStorage.setItem('techshop_user', JSON.stringify(currentUser));
    }
    localStorage.setItem('techshop_wheel', JSON.stringify(hasSpunWheel));
    localStorage.setItem('techshop_cart', JSON.stringify(cart));
    localStorage.setItem('techshop_discount', JSON.stringify(appliedDiscount));
    localStorage.setItem('techshop_shipping', JSON.stringify(freeShipping));
  };

  useEffect(() => {
    saveData();
  }, [currentUser, hasSpunWheel, cart, appliedDiscount, freeShipping]);

  const handleLogin = (email: string, password: string, name?: string) => {
    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        setShowLoginModal(false);
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${user.name}!`,
        });
        
        if (!hasSpunWheel) {
          setTimeout(() => setShowWheelModal(true), 1000);
        }
      } else {
        toast({
          title: "Erro",
          description: "Email ou senha incorretos!",
          variant: "destructive",
        });
      }
    } else {
      if (!name?.trim()) {
        toast({
          title: "Erro",
          description: "Por favor, preencha o nome!",
          variant: "destructive",
        });
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        toast({
          title: "Erro",
          description: "Email já cadastrado!",
          variant: "destructive",
        });
        return;
      }
      
      const newUser = { email, password, name: name.trim() };
      users.push(newUser);
      localStorage.setItem('techshop_users', JSON.stringify(users));
      
      setCurrentUser(newUser);
      setShowLoginModal(false);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo, ${newUser.name}!`,
      });
      
      setTimeout(() => setShowWheelModal(true), 1000);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHasSpunWheel(false);
    setCart([]);
    setAppliedDiscount(0);
    setFreeShipping(false);
    
    localStorage.removeItem('techshop_user');
    localStorage.removeItem('techshop_wheel');
    localStorage.removeItem('techshop_cart');
    localStorage.removeItem('techshop_discount');
    localStorage.removeItem('techshop_shipping');
    
    toast({
      title: "Logout realizado com sucesso!",
    });
  };

  const addToCart = (productId: number) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const updateCartQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (appliedDiscount / 100);
    const shippingCost = freeShipping ? 0 : 15;
    return subtotal - discountAmount + shippingCost;
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const spinWheel = () => {
    if (hasSpunWheel || isSpinning) return;
    
    setIsSpinning(true);
    const prizes = [
      { text: "10% de desconto", discount: 10 },
      { text: "15% de desconto", discount: 15 },
      { text: "Frete grátis", freeShipping: true },
      { text: "5% de desconto", discount: 5 },
      { text: "Cupom Especial", discount: 20 },
      { text: "Nada :(", nothing: true }
    ];
    
    const spins = Math.floor(Math.random() * 6) + 5;
    const finalRotation = spins * 360 + Math.floor(Math.random() * 360);
    setWheelRotation(finalRotation);
    
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const sectorAngle = 360 / 6;
      const pointerPosition = (360 - normalizedRotation + (sectorAngle / 2)) % 360;
      const winningIndex = Math.floor(pointerPosition / sectorAngle);
      
      const prize = prizes[winningIndex];
      
      if (prize.discount) {
        setAppliedDiscount(prize.discount);
      }
      if (prize.freeShipping) {
        setFreeShipping(true);
      }
      
      setPrizeResult(prize.text);
      setHasSpunWheel(true);
      setIsSpinning(false);
      
      toast({
        title: "🎉 Parabéns!",
        description: `Você ganhou: ${prize.text}`,
      });
      
      setTimeout(() => {
        setShowWheelModal(false);
        setPrizeResult('');
      }, 3000);
    }, 4000);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...chatMessages, { text: chatInput, sender: 'user' as const }];
    setChatMessages(newMessages);
    
    const lowerMessage = chatInput.toLowerCase();
    let response = chatResponses.default;
    
    for (const [keyword, chatResponse] of Object.entries(chatResponses)) {
      if (lowerMessage.includes(keyword)) {
        response = chatResponse;
        break;
      }
    }
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 1000);
    
    setChatInput('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho primeiro!",
        variant: "destructive",
      });
      return;
    }
    
    setCart([]);
    setShowCheckoutModal(false);
    toast({
      title: "🎉 Compra realizada com sucesso!",
      description: "Obrigado por comprar conosco!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🎮 TechShop</h1>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                  onClick={handleLogout}
                >
                  Sair ({currentUser.name})
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                  onClick={() => setShowLoginModal(true)}
                >
                  Entrar
                </Button>
              )}
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-600 relative"
                onClick={() => currentUser ? setShowCartModal(true) : setShowLoginModal(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bem-vindo à TechShop!
          </h2>
          <p className="text-xl text-gray-600">
            Sua loja de tecnologia com experiência gamificada
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Nossos Produtos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2">{product.name}</CardTitle>
                  <CardDescription className="mb-4">{product.description}</CardDescription>
                  <div className="text-2xl font-bold text-purple-600 mb-4">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}
                    >
                      Saiba mais
                    </Button>
                    <Button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => addToCart(product.id)}
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Wheel Modal */}
      <Dialog open={showWheelModal} onOpenChange={setShowWheelModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎉 Gire a Roleta e Ganhe Prêmios!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-80 h-80">
              {/* Wheel Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-gray-800"></div>
              </div>
              
              {/* Wheel */}
              <div 
                className="w-full h-full rounded-full border-4 border-gray-800 relative overflow-hidden transition-transform duration-[4s] ease-out"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right bg-red-500 flex items-center justify-center text-white font-bold text-sm" style={{ transform: 'rotate(0deg)' }}>
                  10% OFF
                </div>
                <div className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right bg-teal-500 flex items-center justify-center text-white font-bold text-sm" style={{ transform: 'rotate(60deg)' }}>
                  15% OFF
                </div>
                <div className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right bg-blue-500 flex items-center justify-center text-white font-bold text-sm" style={{ transform: 'rotate(120deg)' }}>
                  FRETE GRÁTIS
                </div>
                <div className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right bg-yellow-500 flex items-center justify-center text-white font-bold text-sm" style={{ transform: 'rotate(180deg)' }}>
                  5% OFF
                </div>
                <div className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right bg-purple-500 flex items-center justify-center text-white font-bold text-sm" style={{ transform: 'rotate(240deg)' }}>
                  CUPOM ESPECIAL
                </div>
                <div className="absolute inset-0 w-1/2 h-1/2 origin-bottom-right bg-pink-500 flex items-center justify-center text-white font-bold text-sm" style={{ transform: 'rotate(300deg)' }}>
                  NADA 😢
                </div>
              </div>
            </div>
            
            <Button 
              onClick={spinWheel} 
              disabled={hasSpunWheel || isSpinning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSpinning ? 'Girando...' : hasSpunWheel ? 'Já girou!' : 'Girar Roleta!'}
            </Button>
            
            {prizeResult && (
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <h4 className="font-bold">🎉 Parabéns!</h4>
                <p>Você ganhou: <strong>{prizeResult}</strong></p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isLogin ? 'Entrar' : 'Cadastrar'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleLogin(
              formData.get('email') as string,
              formData.get('password') as string,
              formData.get('name') as string
            );
          }} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" required />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input type="password" name="password" required />
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input type="text" name="name" required />
              </div>
            )}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>
          <p className="text-center text-sm">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Entre aqui'}
            </button>
          </p>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p>{selectedProduct.description}</p>
                <div className="text-2xl font-bold text-purple-600">
                  R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">⭐ Avaliações dos Clientes</h4>
                  <div className="space-y-3">
                    {selectedProduct.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <strong>{review.user}</strong>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    addToCart(selectedProduct.id);
                    setShowProductModal(false);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🛒 Seu Carrinho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(appliedDiscount > 0 || freeShipping) && (
                  <div className="bg-green-100 p-3 rounded-lg">
                    {appliedDiscount > 0 && (
                      <p>🎉 Desconto de {appliedDiscount}% aplicado!</p>
                    )}
                    {freeShipping && (
                      <p>🚚 Frete Grátis Ativado!</p>
                    )}
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="text-xl font-bold">
                    Total: R$ {getCartTotal().toFixed(2).replace('.', ',')}
                  </div>
                  <Button 
                    onClick={() => {
                      setShowCartModal(false);
                      setShowCheckoutModal(true);
                    }}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Finalizar Compra
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>💳 Finalizar Compra</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCheckout();
          }} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input type="text" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input type="text" name="address" required />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input type="text" name="city" required />
            </div>
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="text-xl font-bold">
              Total: R$ {getCartTotal().toFixed(2).replace('.', ',')}
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Confirmar Compra
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <Card className="w-80 h-96 flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg">🤖 Assistente IA</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <Button onClick={sendChatMessage} size="sm">
                Enviar
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            onClick={() => setShowChat(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
