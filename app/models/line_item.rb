class LineItem < ActiveRecord::Base
  belongs_to :order
  belongs_to :product
  belongs_to :cart

  def total_price
    if product.present?
     price * quantity.to_i
    else
      0
    end
  end

  def article
    product.article
  end

  def price user = nil
    if price_fixed.nil?
      product.price_with_margin user
    else
      price_fixed
    end
  end

  def image_url
    product.image_url
  end

  def quantity_product
    product.quantity
  end

end
