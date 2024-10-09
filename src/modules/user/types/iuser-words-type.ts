export interface IUserWordsEntity {
  id: string
  email: string
  password: string
  confirmed_at: Date
  deleted_at: Date
  banned_until: Date
  last_sign_in_at: Date
  updated_at: Date
  word_usage: word_usage
  subscriptions: subscriptions[]
  profile: profile
  image_url: string
  role: string
  stripeId: string
}

interface word_usage {
  id: number
  word_quantity: number
}

interface profile {
  phone: string
  state: string
  city: string
  name: string
}

interface subscriptions {
  id: number
  created_at: Date
  updated_at: Date
  user_email: string
  stripe_customer_id: string
  is_trial_active: boolean
  expired_at: Date
  is_subscription_active: boolean
  plans: plans
}

interface plans {
  id: number
  created_at: Date
  price: number
  name: string
  word_limit: number
  stripe_product_id: string
  gptModel: string
}
