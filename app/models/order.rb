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
                     "В пределах КАД [300 рублей]",
                     "В Ленинградскую область [1500 рублей]",
                     "В регионы [согласовывается с менеджером, 300 рублей до транспортной компании]"
  ]

  STATUS = {
      0 => "Принят",
      1 => "Ожидает оплату",
      2 => "Оплачен, ожидает доставку",
      3 => "Ожидает доставку",
      4 => "Доставлен",
      5 => "Отменен"
  }

  validates :email, email_format: { message: "Не выглядит как электронный адресс" }

  def self.statusInvert
    STATUS.invert
  end

  def self.STATUS (i)
    STATUS[i]
  end

  def status_title
    STATUS[self.status]
  end

  validates :name, :email, presence: true #, :address
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

  def line_items_not_available
    LineItem.joins(:product).where("line_items.order_id = ? AND products.quantity = 0 OR products.quantity = NULL", id)
  end

  def line_items_in_stock
    LineItem.joins(:product).where("line_items.order_id = ? AND products.quantity > 0", id)
  end

  def total_price_not_available
    line_items_not_available.to_a.sum {|item| item.total_price}
  end

  def total_price_in_stock
    line_items_in_stock.to_a.sum {|item| item.total_price}
  end

  def self.when_the_delivery when_date

    case when_date.wday
      when 5
        'Доставим во вторник в пределах КАД за 300<span class="ruble">a</span>'
      when 4
        'Доставим в понедельник в пределах КАД за 300<span class="ruble">a</span>'
      else
        'Доставим послезавтра в пределах КАД за 300<span class="ruble">a</span>'
    end

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
