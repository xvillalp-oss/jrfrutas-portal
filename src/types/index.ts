export type RestaurantStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'

export interface Category {
  id: string
  name: string
  slug: string
  emoji: string
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  unit: string
  price_per_kg: number
  min_quantity_kg: number
  available: boolean
  featured: boolean
  image_url: string | null
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Restaurant {
  id: string
  user_id: string
  business_name: string
  contact_name: string
  phone: string
  email: string
  address: string
  municipality: string
  city: 'CDMX' | 'Estado de Mexico'
  rfc: string | null
  restaurant_type: string | null
  status: RestaurantStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
  approved_at: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity_kg: number
  unit_price: number
  created_at: string
  products?: Product
}

export interface Order {
  id: string
  order_number: string
  restaurant_id: string
  status: OrderStatus
  delivery_date: string
  total_kg: number
  notes: string | null
  created_at: string
  updated_at: string
  restaurants?: Restaurant
  order_items?: OrderItem[]
}

export interface CartItem {
  product: Product
  quantity_kg: number
}
