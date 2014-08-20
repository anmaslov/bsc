class Cart < ActiveRecord::Base
  has_many :line_items, dependent: :destroy

  def add_product(product_id, line_item)
    current_item = line_items.find_by(product_id: product_id)
    quantity = line_item[:quantity].to_i
    if current_item
      current_item.quantity = current_item.quantity.to_i + quantity
    else
      current_item = line_items.build(product_id: product_id)
      current_item.quantity = quantity
    end
    current_item
  end

  def change_quantity(product_id, line_item, quantity)
    current_item = line_items.find_by(product_id: product_id)
    if current_item
      current_item.quantity = quantity
    else
      current_item = line_items.build(product_id: product_id)
      current_item.quantity = quantity
    end
    current_item
  end


  def total_price
    line_items.to_a.sum {|item| item.total_price }
  end

end
