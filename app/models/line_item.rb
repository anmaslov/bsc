class LineItem < ActiveRecord::Base
  belongs_to :order
  belongs_to :product
  belongs_to :cart

  def total_price
    if product.present?
     product.price * quantity.to_i
    else
      0
    end
  end

  def article
    product.article
  end

  def price
    product.price
  end

  def image_url
    product.image_url
  end

end
