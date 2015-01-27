# encoding: utf-8
class Order < ActiveRecord::Base
  has_many :line_items, dependent: :destroy
  belongs_to :user
  PAYMENT_TYPES = [ "Наличные",
                    "Курьеру Visa/MasterCard при получении",
                    "Банковской картой Visa/MasterCard",
                    "Счет для юридических лиц"

  ]
  DELIVERY_TYPES = [ "Самовывоз [ул. Сабировская, 41]",
                     "В пределах КАД [400 рублей]",
                     "В Ленинградскую область [1500 рублей]",
                     "В регионы [согласовывается с менеджером]"
  ]

  STATUS = {
      0 => "Принят",
      1 => "Ожидает оплату",
      2 => "Оплачен, ожидает отправку",
      3 => "Ожидает оптавку",
      4 => "Доставлен",
      5 => "Отменен"
  }

  def self.statusInvert
    STATUS.invert
  end

  def self.STATUS (i)
    STATUS[i]
  end

  def status_title
    STATUS[self.status]
  end

  validates :name, :address, :email, presence: true
  validates :pay_type, inclusion: PAYMENT_TYPES
  validates :delivery_type, inclusion: DELIVERY_TYPES
  def add_line_items_from_cart(cart)
    cart.line_items.each do |item|
      item.cart_id = nil
      line_items << item
    end
  end

  def total_price
    line_items.to_a.sum {|item| item.total_price }
  end

  # def to_csv
  #   CSV.generate do |csv|
  #     csv << column_names
  #     line_items.each do |line_item|
  #       csv << line_item.attributes.values_at(*column_names)
  #     end
  #   end
  # end

end
