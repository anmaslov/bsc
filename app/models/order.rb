# encoding: utf-8
class Order < ActiveRecord::Base
  has_many :line_items, dependent: :destroy
  belongs_to :user
  PAYMENT_TYPES = [ "Наличные", "Курьеру Visa/MasterCard при получении", "Банковской картой Visa/MasterCard"]
  DELIVERY_TYPES = [ "Самовывоз [ул. Сабировская, 41]",
                     "В пределах КАД [400 рублей]",
                     "В Ленинградскую область [1500 рублей]",
                     "В регионы [согласовывается с менеджером]"
  ]

  validates :name, :address, :email, presence: true
  validates :pay_type, inclusion: PAYMENT_TYPES
  #validates :delivery_type, inclusion: DELIVERY_TYPES
  def add_line_items_from_cart(cart)
    cart.line_items.each do |item|
      item.cart_id = nil
      line_items << item
    end
  end
end
