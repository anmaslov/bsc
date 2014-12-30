class Compare < ActiveRecord::Base
  has_many :compare_items, dependent: :destroy
  has_many :products, through: :compare_items

  def add_product(product_id, compare_item)
    current_item = compare_items.find_by(product_id: product_id)
    if current_item.nil?
      current_item = compare_items.build(product_id: product_id)
    end
    current_item
  end

end
